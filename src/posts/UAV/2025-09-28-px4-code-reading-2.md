---
icon: pen-to-square
date: 2025-09-28
tag:
  - UAV
  - PX4
category:
  - UAV
---

# PX4飞控代码阅读（2）位置环

## 多旋翼控制器结构

整体控制器结构如下

![控制器结构](https://docs.px4.io/main/assets/mc_control_arch.DPb5OeqV.jpg)

各模块分别位于：
- Position Control, Velocity Control, Acceleration&Yaw to Attitude: `src\modules\mc_pos_control`
- Angle Control: `src\modules\mc_att_control`
- Angular Rate Control: `src\modules\mc_rate_control`
- Mixer: `src\modules\control_allocator`

## 速度控制量计算

位置控制的代码位于`src\modules\mc_pos_control\PositionControl\PositionControl.cpp`，核心函数为`update`：

```c++
bool PositionControl::update(const float dt)
{
	bool valid = _inputValid();

	if (valid) {
		_positionControl();
		_velocityControl(dt);

		_yawspeed_sp = PX4_ISFINITE(_yawspeed_sp) ? _yawspeed_sp : 0.f;
		_yaw_sp = PX4_ISFINITE(_yaw_sp) ? _yaw_sp : _yaw; // TODO: better way to disable yaw control
	}

	// There has to be a valid output acceleration and thrust setpoint otherwise something went wrong
	return valid && _acc_sp.isAllFinite() && _thr_sp.isAllFinite();
}
```

第6行根据位置设定点计算速度设定点：

```c++
void PositionControl::_positionControl()
{
	// P-position controller
	Vector3f vel_sp_position = (_pos_sp - _pos).emult(_gain_pos_p);
	// Position and feed-forward velocity setpoints or position states being NAN results in them not having an influence
	ControlMath::addIfNotNanVector3f(_vel_sp, vel_sp_position);
	// make sure there are no NAN elements for further reference while constraining
	ControlMath::setZeroIfNanVector3f(vel_sp_position);

	// Constrain horizontal velocity by prioritizing the velocity component along the
	// the desired position setpoint over the feed-forward term.
	_vel_sp.xy() = ControlMath::constrainXY(vel_sp_position.xy(), (_vel_sp - vel_sp_position).xy(), _lim_vel_horizontal);
	// Constrain velocity in z-direction.
	_vel_sp(2) = math::constrain(_vel_sp(2), -_lim_vel_up, _lim_vel_down);
}
```

首先通过一个P控制器计算速度控制量（第4行）：
$$
\mathbf{V}_{sp,position}=\mathbf{K}_{P,pos}\cdot(\mathbf{X}_{sp}-\mathbf{X})
$$
然后加上一个前馈项（来自期望轨迹上的期望速度，或是用户输入，或是简单设置为0）（第6行）：
$$
\mathbf{V}_{sp}=\mathbf{V}_{ff}+\mathbf{V}_{sp,position}
$$
 最后分别对水平XY方向的速度和垂直Z方向的速度进行限制。水平方向上优先保证$\mathbf{V}_{sp,position}$，垂直方向则是简单的标量clip。

:::note

水平方向的限制原理为：

- 如果$\mathbf{V}_{sp,position}+\mathbf{V}_{ff}$不超过限制，则直接使用它

- 如果$\mathbf{V}_{sp,position}$超过限制，则将它缩放到max

- 如果两个向量相等，则使用$\mathbf{V}_{sp,position}$缩放到max

- 如果$\mathbf{V}_{sp,position}$为0，则将$\mathbf{V}_{ff}$缩放到max

-  否则，使用下面的代码，将$\mathbf{V}_{ff}$缩放使得最终的值满足限制。这是通过解二次方程$||\vec{v}+s\vec{u}||^2=max^2$得到的

  ```c++
  Vector2f u1 = v1.normalized();
  float m = u1.dot(v0);
  float c = v0.dot(v0) - max * max;
  float s = -m + sqrtf(m * m - c);
  return v0 + u1 * s;
  ```

::: 

## 加速度控制量计算

加速度控制量计算的代码：

```c++ 
void PositionControl::_velocityControl(const float dt)
{
	// Constrain vertical velocity integral
	_vel_int(2) = math::constrain(_vel_int(2), -CONSTANTS_ONE_G, CONSTANTS_ONE_G);

	// PID velocity control
	Vector3f vel_error = _vel_sp - _vel;
	Vector3f acc_sp_velocity = vel_error.emult(_gain_vel_p) + _vel_int - _vel_dot.emult(_gain_vel_d);

	// No control input from setpoints or corresponding states which are NAN
	ControlMath::addIfNotNanVector3f(_acc_sp, acc_sp_velocity);

	_accelerationControl();

	// ......
}
```

核心的PID计算为：
$$
\mathbf{A}_{sp}=\mathbf{K}_{P,vel}\cdot(\mathbf{V}_{sp}-\mathbf{V}) + \mathbf{I}_{vel} + \mathbf{K}_{D,vel}(0-\dot{\mathbf{V}})
$$
这里的微分并不是误差项的微分，可以理解为期望速度为0时的误差项的微分，这是PX4为了使速度变化平缓进行的工程优化，后面角速度的控制也有类似设计。

接下来调用`_accelerationControl()`来计算期望姿态和油门设定，暂且按下不表，后面的代码进行抗饱和积分和推力分配。首先是对垂直方向的积分采用条件积分法进行抗饱和：

```c++
// Integrator anti-windup in vertical direction
if ((_thr_sp(2) >= -_lim_thr_min && vel_error(2) >= 0.f) ||
    (_thr_sp(2) <= -_lim_thr_max && vel_error(2) <= 0.f)) {
    vel_error(2) = 0.f;
}
```

然后提取水平方向的推力，进行推力的预分配。预分配的原则是，优先满足垂直方向的控制，但保留一部分水平控制能力，因此首先预分配水平方向的推力：

```c++
const float allocated_horizontal_thrust = math::min(thrust_sp_xy_norm, _lim_thr_xy_margin);
```

`thrust_sp_xy_norm`是水平推力的大小，将其限制在`_lim_thr_xy_margin`以内。接下来计算可供垂直方向使用的剩余推力：

```c++
const float thrust_z_max_squared = thrust_max_squared - math::sq(allocated_horizontal_thrust);
```

这就是用最大推力的平方减去上一步分配给水平方向的推力平方。接下来使用这个值对垂直推力进行裁剪：

```c++
_thr_sp(2) = math::max(_thr_sp(2), -sqrtf(thrust_z_max_squared));
```

然后再计算除掉垂直推力后真正剩余给水平推力的裕度：

```c++
const float thrust_max_xy_squared = thrust_max_squared - math::sq(_thr_sp(2));
float thrust_max_xy = 0.f;

if (thrust_max_xy_squared > 0.f) {
    thrust_max_xy = sqrtf(thrust_max_xy_squared);
}
```

再用这个裕度裁剪水平推力，得到真正分配给水平方向的推力大小：

```c++
if (thrust_sp_xy_norm > thrust_max_xy) {
    _thr_sp.xy() = thrust_sp_xy / thrust_sp_xy_norm * thrust_max_xy;
}
```

最后，对水平方向的加速度进行跟踪法抗饱和积分，其原理是将裁剪后的输出和期望输出作差，然后通过一个反馈增益反馈给积分环节，来调节积分器的饱和程度。

```c++ 
// Use tracking Anti-Windup for horizontal direction: during saturation, the integrator is used to unsaturate the output
// see Anti-Reset Windup for PID controllers, L.Rundqwist, 1990
const Vector2f acc_sp_xy_produced = Vector2f(_thr_sp) * (CONSTANTS_ONE_G / _hover_thrust);

// The produced acceleration can be greater or smaller than the desired acceleration due to the saturations and the actual vertical thrust (computed independently).
// The ARW loop needs to run if the signal is saturated only.
if (_acc_sp.xy().norm_squared() > acc_sp_xy_produced.norm_squared()) {
    const float arw_gain = 2.f / _gain_vel_p(0);
    const Vector2f acc_sp_xy = _acc_sp.xy();

    vel_error.xy() = Vector2f(vel_error) - arw_gain * (acc_sp_xy - acc_sp_xy_produced);
}

// ......

// Update integral part of velocity control
_vel_int += vel_error.emult(_gain_vel_i) * dt;
```

代码首先计算水平推力能产生的加速度，用$g$除以悬停推力来归一化。然后，如果出现饱和，则将速度的水平误差减去跟踪增益`arw_gain`乘饱和量，再以这个值进行积分。

## 期望姿态和推力计算

<center><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="150" height="150" style="
        width:150;
        height:150;
        background: #FFF;
        fill: none;
"><svg xmlns="http://www.w3.org/2000/svg" class="role-diagram-draw-area"><g class="shapes-region" style="stroke: black; fill: none;"><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M43,60 L112.6,93.4" style="stroke: rgb(74, 144, 226); stroke-width: 1; fill: none; fill-opacity: 1; stroke-opacity: 1;"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M77.8,76.7 L114.62,11.14" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/><g stroke="#000" transform="matrix(-0.4896868315299688,0.871898392604402,-0.871898392604402,-0.4896868315299688,115.59997558593749,9.399993896484375)" style="stroke: rgb(0, 0, 0); stroke-width: 1;"><path d=" M10.93,-3.29 Q4.96,-0.45 0,0 Q4.96,0.45 10.93,3.29"/></g></g><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M77.8,76.7 L78.56,118.4" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/><g stroke="#000" transform="matrix(-0.018324931396102726,-0.9998320843468308,0.9998320843468308,-0.018324931396102726,78.5999755859375,120.39999389648438)" style="stroke: rgb(0, 0, 0); stroke-width: 1;"><path d=" M10.93,-3.29 Q4.96,-0.45 0,0 Q4.96,0.45 10.93,3.29"/></g></g><g class="arrow-line"><path class="connection real" stroke-dasharray="" d="  M77.8,76.7 L112.7,65.03" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/><g stroke="#000" transform="matrix(-0.9484343576484933,0.31697360967735155,-0.31697360967735155,-0.9484343576484933,114.5999755859375,64.39999389648438)" style="stroke: rgb(0, 0, 0); stroke-width: 1;"><path d=" M10.93,-3.29 Q4.96,-0.45 0,0 Q4.96,0.45 10.93,3.29"/></g></g><g class="arrow-line"><path class="connection real" stroke-dasharray="1.125 3.35" d="  M115.6,9.4 L114.6,64.4" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/></g><g class="arrow-line"><path class="connection real" stroke-dasharray="6 6" d="  M114.6,64.4 L78.6,120.4" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: none; fill-opacity: 1;"/></g><g/></g><g/><g/><g/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="660.0000610351562" height="300.0000305175781" style="width:660.0000610351562px;height:300.0000305175781px;font-family:Asana-Math, Asana;background:#FFF;"><g><g><g><g transform="matrix(1,0,0,1,50.5333251953125,117.53335571289062)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M730 103L704 86C675 67 653 56 643 56C636 56 630 65 630 76C630 86 632 95 637 116L712 413C716 430 719 446 719 454C719 471 709 482 693 482C664 482 626 464 565 421C502 376 467 341 418 272L448 409C452 429 455 444 455 451C455 470 445 482 429 482C399 482 353 460 298 418C254 384 234 363 169 275L202 408C206 424 208 439 208 451C208 470 199 482 185 482C164 482 126 461 52 408L24 388L31 368C68 391 103 414 110 414C121 414 128 404 128 389C128 338 87 145 46 2L49 -9L117 6L139 108C163 219 190 278 245 338C287 384 332 414 360 414C367 414 371 406 371 393C371 358 349 244 308 69L292 2L297 -9L366 6L387 113C403 194 437 269 481 318C536 379 586 414 618 414C626 414 631 405 631 389C631 365 628 351 606 264C566 105 550 84 550 31C550 6 561 -9 580 -9C606 -9 642 12 740 85ZM1052 482C985 482 832 419 832 259C832 182 877 136 954 136C962 136 973 136 984 137L943 99C927 84 916 66 916 52C916 42 923 31 937 19C868 -4 740 -48 740 -159C740 -230 810 -276 919 -276C1048 -276 1161 -204 1161 -121C1161 -85 1140 -49 1097 -14L1037 35C1003 62 990 81 990 100C990 114 1005 128 1017 146C1115 170 1186 253 1186 342C1186 357 1183 376 1182 380C1199 378 1207 378 1216 378C1233 378 1243 379 1266 382L1275 427L1272 433C1244 426 1224 424 1170 424C1170 425 1146 482 1052 482ZM953 1L1030 -58C1076 -94 1095 -121 1095 -154C1095 -206 1026 -248 943 -248C861 -248 804 -206 804 -145C804 -43 914 -11 953 1ZM1027 448C1085 448 1114 412 1114 341C1114 238 1066 168 996 168C935 168 903 209 903 288C903 383 954 448 1027 448Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,121.5333251953125,72.53334045410156)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M730 103L704 86C675 67 653 56 643 56C636 56 630 65 630 76C630 86 632 95 637 116L712 413C716 430 719 446 719 454C719 471 709 482 693 482C664 482 626 464 565 421C502 376 467 341 418 272L448 409C452 429 455 444 455 451C455 470 445 482 429 482C399 482 353 460 298 418C254 384 234 363 169 275L202 408C206 424 208 439 208 451C208 470 199 482 185 482C164 482 126 461 52 408L24 388L31 368C68 391 103 414 110 414C121 414 128 404 128 389C128 338 87 145 46 2L49 -9L117 6L139 108C163 219 190 278 245 338C287 384 332 414 360 414C367 414 371 406 371 393C371 358 349 244 308 69L292 2L297 -9L366 6L387 113C403 194 437 269 481 318C536 379 586 414 618 414C626 414 631 405 631 389C631 365 628 351 606 264C566 105 550 84 550 31C550 6 561 -9 580 -9C606 -9 642 12 740 85ZM1048 204L1019 77C1015 60 1013 42 1013 26C1013 4 1022 -9 1037 -9C1060 -9 1101 17 1183 85L1176 106C1152 86 1123 59 1101 59C1092 59 1086 68 1086 82C1086 87 1086 90 1087 93L1179 472L1169 481L1136 463C1095 478 1078 482 1051 482C1023 482 1003 477 976 464C914 433 881 403 856 354C812 265 781 145 781 67C781 23 796 -11 815 -11C852 -11 932 41 1048 204ZM1096 414C1074 305 1055 253 1021 201C964 117 903 59 871 59C859 59 853 72 853 99C853 163 881 280 916 360C940 415 963 433 1011 433C1034 433 1052 429 1096 414Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g><g><g><g><g transform="matrix(1,0,0,1,121.5333251953125,19.533340454101562)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M286 646L392 650C454 650 494 641 495 626L503 537L527 537C530 600 537 651 548 689C526 691 498 692 481 692L440 691L275 689L246 689C221 689 181 690 143 691L94 692L91 664L147 662C171 661 182 652 182 635C182 621 178 589 173 559L98 125C81 33 81 32 40 28L4 25L0 -3L34 -2C74 -1 106 0 127 0C145 0 174 -1 213 -2L265 -3L268 25L204 28C177 29 168 37 168 57C168 63 169 74 170 78L206 301L323 301C350 301 381 300 429 298L455 297L474 342L470 349C389 345 329 343 251 343L214 343L260 614C263 630 264 635 269 646Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g><g><g><g><g><g transform="matrix(1,0,0,1,131.48333740234375,22.54167785644531)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M251 722L239 733C187 707 151 698 79 691L75 670L123 670C147 670 157 663 157 648C157 645 157 640 154 622C143 567 70 182 55 132C42 82 36 52 36 31C36 6 47 -9 66 -9C92 -9 128 12 226 85L216 103L190 86C161 67 139 56 129 56C122 56 116 66 116 76C116 82 117 89 120 104ZM311 388L318 368L350 389C387 412 390 414 397 414C407 414 415 404 415 391C415 384 411 361 407 347L341 107C333 76 328 49 328 30C328 6 339 -9 358 -9C384 -9 420 12 518 85L508 103L482 86C453 67 430 56 421 56C414 56 408 66 408 76C408 86 410 95 415 116L492 420C496 437 498 448 498 456C498 473 489 482 473 482C451 482 414 461 339 408ZM505 712C476 712 447 679 447 645C447 620 462 604 486 604C517 604 541 633 541 671C541 695 526 712 505 712ZM899 437L883 437L904 549C920 635 948 673 994 673C1024 673 1051 658 1066 634L1076 638C1081 654 1091 685 1099 705L1104 720C1088 727 1057 733 1034 733C1023 733 1007 730 999 726C975 715 893 654 870 630C848 608 836 578 825 521L810 442C769 422 749 414 724 405L719 383L800 383L791 327C761 132 724 -54 702 -123C684 -182 654 -213 618 -213C595 -213 584 -206 566 -184L552 -188C548 -211 534 -259 529 -268C538 -273 553 -276 564 -276C605 -276 659 -245 698 -198C769 -114 789 -18 873 383L977 383C981 402 988 425 994 439L990 446C961 439 962 437 899 437ZM1229 390L1173 107C1172 99 1160 61 1160 31C1160 6 1171 -9 1190 -9C1225 -9 1260 11 1338 74L1369 99L1359 117L1314 86C1285 66 1265 56 1254 56C1245 56 1240 64 1240 76C1240 102 1254 183 1283 328L1296 390L1403 390L1414 440C1376 436 1342 434 1304 434C1320 528 1331 577 1349 631L1338 646C1318 634 1291 622 1260 610L1235 440C1191 419 1165 408 1147 403L1145 390Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></g></g></g></g></g></g></svg></svg></center>

如图所示，升力、重力和无人机的加速度方向有着这样的关系，而升力始终垂直于无人机平面，因此可以通过它来算出期望的姿态。采用NED（北、东、下方向为正）坐标系，则机身方向向量：
$$
\mathbf{b}_z=-\mathbf{a}_{lift}=-\frac{1}{m}(m\mathbf{A}_{sp}-\mathbf{G})=\left[\begin{matrix}
-a_x \\
-a_y \\
-a_z+g
\end{matrix}\right]
$$
对应的代码：

```c++
void PositionControl::_accelerationControl()
{
	// Assume standard acceleration due to gravity in vertical direction for attitude generation
	float z_specific_force = -CONSTANTS_ONE_G;

	if (!_decouple_horizontal_and_vertical_acceleration) {
		// Include vertical acceleration setpoint for better horizontal acceleration tracking
		z_specific_force += _acc_sp(2);
	}

	Vector3f body_z = Vector3f(-_acc_sp(0), -_acc_sp(1), -z_specific_force).normalized();
    // ...
```

这里通过`_decouple_horizontal_and_vertical_acceleration`来设置是否耦合纵向加速度。

然后限制倾斜在安全范围内：

```c++
ControlMath::limitTilt(body_z, Vector3f(0, 0, 1), _lim_tilt);
```

计算出的机身方向向量在`PositionControl::getAttitudeSetpoint`函数中被转换成四元数，作为机身姿态控制环的输入。

接下来计算油门，垂直方向的油门大小为（向下为正）
$$
\sigma_z=a_z\frac{\sigma_0}{g}-\sigma_0
$$
这里$\sigma_0$是`_hover_thrust`即悬停油门，相当于$mg$。最后减去悬停油门是因为向上的方向为负。这里计算出来的一般是一个负数。

然后计算垂直机体方向的总油门大小：
$$
\sigma=\frac{\sigma_z}{\mathbf{b}_z\cdot[0\;0\;1]}
$$
这里的分母是机身方向单位向量在z轴方向的分量。代码中实际上还进行了一次裁剪以确保不超过油门限值。最后，乘以机身单位向量来得到矢量的油门：
$$
\vec{\sigma}=\sigma\mathbf{b}_z
$$


对应的代码如下：

```c++
// Convert to thrust assuming hover thrust produces standard gravity
const float thrust_ned_z = _acc_sp(2) * (_hover_thrust / CONSTANTS_ONE_G) - _hover_thrust;
// Project thrust to planned body attitude
const float cos_ned_body = (Vector3f(0, 0, 1).dot(body_z));
const float collective_thrust = math::min(thrust_ned_z / cos_ned_body, -_lim_thr_min);
_thr_sp = body_z * collective_thrust;
```

