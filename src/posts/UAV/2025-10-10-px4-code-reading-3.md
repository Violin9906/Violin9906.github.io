---
icon: pen-to-square
date: 2025-10-10
tag:
  - UAV
  - PX4
category:
  - UAV
---

# PX4飞控代码阅读（3）姿态环

## 角度控制器

角度控制器主要代码位于`src/modules/mc_att_control/AttitudeControl/AttitudeControl.cpp`中，其核心为`update`函数。

角度控制采取了倾转分离的策略，倾斜（俯仰、偏航）的控制能力较强，而转向（偏航）的控制能力较弱，因此采用了不同的控制增益，将转向的控制量按比例缩小。

首先计算当前姿态和期望姿态分别对应的z轴方向（世界坐标系）：
```c++
// calculate reduced desired attitude neglecting vehicle's yaw to prioritize roll and pitch
const Vector3f e_z = q.dcm_z();
const Vector3f e_z_d = qd.dcm_z();
```
然后计算这一旋转对应的四元数，即倾斜部分的四元数（世界坐标系）：
```c++
Quatf qd_red(e_z, e_z_d);
```
这里调用的构造函数为（`src/lib/matrix/matrix/Quaternion.hpp`）
```c++
/**
    * Quaternion from two vectors
    * Generates shortest rotation from source to destination vector
    *
    * @param dst destination vector (no need to normalize)
    * @param src source vector (no need to normalize)
    * @param eps epsilon threshold which decides if a value is considered zero
    */
Quaternion(const Vector3<Type> &src, const Vector3<Type> &dst, const Type eps = Type(1e-5))
{
    Quaternion &q = *this;
    Vector3<Type> cr = src.cross(dst);
    const float dt = src.dot(dst);

    if (cr.norm() < eps && dt < 0) {
        // handle corner cases with 180 degree rotations
        // if the two vectors are parallel, cross product is zero
        // if they point opposite, the dot product is negative
        cr = src.abs();

        if (cr(0) < cr(1)) {
            if (cr(0) < cr(2)) {
                cr = Vector3<Type>(1, 0, 0);

            } else {
                cr = Vector3<Type>(0, 0, 1);
            }

        } else {
            if (cr(1) < cr(2)) {
                cr = Vector3<Type>(0, 1, 0);

            } else {
                cr = Vector3<Type>(0, 0, 1);
            }
        }

        q(0) = Type(0);
        cr = src.cross(cr);

    } else {
        // normal case, do half-way quaternion solution
        q(0) = dt + std::sqrt(src.norm_squared() * dst.norm_squared());
    }

    q(1) = cr(0);
    q(2) = cr(1);
    q(3) = cr(2);
    q.normalize();
}
```
它通过两个矢量的叉乘来计算旋转轴。但是当两个矢量刚好方向相反时，叉乘为0（旋转轴有无数个）。代码中对此单独进行了处理，但是也提到忽略这种情况也没问题
```c++
if (fabsf(qd_red(1)) > (1.f - 1e-5f) || fabsf(qd_red(2)) > (1.f - 1e-5f)) {
    // In the infinitesimal corner case where the vehicle and thrust have the completely opposite direction,
    // full attitude control anyways generates no yaw input and directly takes the combination of
    // roll and pitch leading to the correct desired yaw. Ignoring this case would still be totally safe and stable.
    qd_red = qd;  
} // ...
```
接下来计算仅包含倾斜的期望姿态四元数（世界坐标系）：
```c++
//...
else {
		// Transform rotation from current to desired thrust vector into a world frame reduced desired attitude.
		// This is a right multiplication as the tilt error quaternion is obtained from two Z vectors expressed in the world frame.
		qd_red *= q;
}
```
这里的符号用的比较乱，前面通过叉乘的出来的`qd_red`其实是一个差值（期望姿态和当前姿态z轴方向的差值），它就是姿态误差中的倾斜分量。将这一分量乘上当前姿态，就得到了世界坐标系下仅包含倾斜的期望姿态`qd_red`。

然后再通过和完整期望姿态`qd`作差的方式来得到转向分量：
```c++
// With a full desired attitude given by: qd = qd_red * qd_dyaw, extract the delta yaw component.
// By definition, the delta yaw quaternion has the form (cos(angle/2), 0, 0, sin(angle/2))
Quatf qd_dyaw = qd_red.inversed() * qd;
qd_dyaw.canonicalize();
// catch numerical problems with the domain of acosf and asinf
qd_dyaw(0) = math::constrain(qd_dyaw(0), -1.f, 1.f);
qd_dyaw(3) = math::constrain(qd_dyaw(3), -1.f, 1.f);
```
其中的`canonicalize`用于消除四元数的二义性。

接下来将偏航角缩小`_yaw_w`，并计算缩放后的期望姿态：
```c++
// scale the delta yaw angle and re-combine the desired attitude
qd = qd_red * Quatf(cosf(_yaw_w * acosf(qd_dyaw(0))), 0.f, 0.f, sinf(_yaw_w * asinf(qd_dyaw(3))));
```
写成公式就是：
$$
\mathbf{q}'_d=\mathbf{q}_{d,red}\cdot \left[\begin{matrix}
\cos(w_{yaw}\theta_{yaw})\\
0\\
0\\
\sin(w_{yaw}\theta_{yaw})
\end{matrix}\right]
$$

下面计算四元数表示的角度误差量。这里其实悄悄的进行了坐标变换，`qe`实际上是在机体系下描述的。
```c++
// quaternion attitude control law, qe is rotation from q to qd
const Quatf qe = q.inversed() * qd;
```
其计算公式如下（为了避免混淆，误差用err标注，e表示世界系，b表示机体系）
$$
\mathbf{q}_{err}^b=(\mathbf{q}^e_b)^* \mathbf{q}^e_{err} \mathbf{q}^e_b = (\mathbf{q}^e_b)^* (\mathbf{q}_d^e(\mathbf{q}_b^e)^*) \mathbf{q}^e_b = (\mathbf{q}^e_b)^* \mathbf{q}_d^e
$$

接下来计算期望角速度，这里采用比例控制器。
```c++
// using sin(alpha/2) scaled rotation axis as attitude error (see quaternion definition by axis angle)
// also taking care of the antipodal unit quaternion ambiguity
const Vector3f eq = 2.f * qe.canonical().imag();

// calculate angular rates setpoint
Vector3f rate_setpoint = eq.emult(_proportional_gain);
```
这里的`_proportional_gain`是增益，其中yaw轴的增益进行了补偿以抵消`_yaw_w`的影响。而`eq`其实是基于下面的近似：
$$
\vec{r}\theta \simeq 2\vec{r}\sin(\theta/2)
$$

最后进行的是前馈项计算和角速度约束，一般四轴飞行器用不到前馈项。
```c++
// Feed forward the yaw setpoint rate.
// yawspeed_setpoint is the feed forward commanded rotation around the world z-axis,
// but we need to apply it in the body frame (because _rates_sp is expressed in the body frame).
// Therefore we infer the world z-axis (expressed in the body frame) by taking the last column of R.transposed (== q.inversed)
// and multiply it by the yaw setpoint rate (yawspeed_setpoint).
// This yields a vector representing the commanded rotatation around the world z-axis expressed in the body frame
// such that it can be added to the rates setpoint.
if (std::isfinite(_yawspeed_setpoint)) {
    rate_setpoint += q.inversed().dcm_z() * _yawspeed_setpoint;
}

// limit rates
for (int i = 0; i < 3; i++) {
    rate_setpoint(i) = math::constrain(rate_setpoint(i), -_rate_limit(i), _rate_limit(i));
}

return rate_setpoint;
```

## 角速度控制器

角速度控制器的核心代码没有在modules里面，而是在`src/lib/rate_control/rate_control.cpp`。
核心的算法其实就是一个PID控制器：
```c++
Vector3f RateControl::update(const Vector3f &rate, const Vector3f &rate_sp, const Vector3f &angular_accel,
			     const float dt, const bool landed)
{
	// angular rates error
	Vector3f rate_error = rate_sp - rate;

	// PID control with feed forward
	const Vector3f torque = _gain_p.emult(rate_error) + _rate_int - _gain_d.emult(angular_accel) + _gain_ff.emult(rate_sp);

	// update integral only if we are not landed
	if (!landed) {
		updateIntegral(rate_error, dt);
	}

	return torque;
}
```
这里D项用了0作为目标值，和速度控制器里面的处理一样。其他的就没什么好说的，很标准的前馈PID控制，前馈项四旋翼一般不用。积分项采用了下面的抗饱和积分：
$$
I_\omega=\int K_I \cdot \max\left\{1-\left(\frac{e_\omega}{e_{\omega,max}}\right)^2,0\right\} \cdot e_\omega \mathrm{d}t
$$
其中$e_{\omega,max}=400$，误差约接近400就越减少积分增益。代码如下：
```c++
void RateControl::updateIntegral(Vector3f &rate_error, const float dt)
{
	for (int i = 0; i < 3; i++) {
		// prevent further positive control saturation
		if (_control_allocator_saturation_positive(i)) {
			rate_error(i) = math::min(rate_error(i), 0.f);
		}

		// prevent further negative control saturation
		if (_control_allocator_saturation_negative(i)) {
			rate_error(i) = math::max(rate_error(i), 0.f);
		}

		// I term factor: reduce the I gain with increasing rate error.
		// This counteracts a non-linear effect where the integral builds up quickly upon a large setpoint
		// change (noticeable in a bounce-back effect after a flip).
		// The formula leads to a gradual decrease w/o steps, while only affecting the cases where it should:
		// with the parameter set to 400 degrees, up to 100 deg rate error, i_factor is almost 1 (having no effect),
		// and up to 200 deg error leads to <25% reduction of I.
		float i_factor = rate_error(i) / math::radians(400.f);
		i_factor = math::max(0.0f, 1.f - i_factor * i_factor);

		// Perform the integration using a first order method
		float rate_i = _rate_int(i) + i_factor * _gain_i(i) * rate_error(i) * dt;

		// do not propagate the result if out of range or invalid
		if (PX4_ISFINITE(rate_i)) {
			_rate_int(i) = math::constrain(rate_i, -_lim_int(i), _lim_int(i));
		}
	}
}
```
