---
icon: pen-to-square
date: 2025-10-11
tag:
  - UAV
  - PX4
category:
  - UAV
---

# PX4飞控代码阅读（4）混控器

1.16版本的PX4混控器改版了，Pipeline如下图：
![](https://docs.px4.io/main/assets/control_allocation_pipeline.JjsICZzU.png)
其中用于计算各执行器分配量的代码位于`src/lib/control_allocation/control_allocation`。

## 控制分配器

控制分配器有两个版本，通过参数`CA_METHOD`控制。

### 伪逆法控制分配器

代码位于`src/lib/control_allocation/control_allocation/ControlAllocationPseudoInverse.cpp`。
假设有$m$个控制轴（如俯仰+滚转+偏航）和$n$个执行器，伪逆法将控制分配问题表示为：
$$
A\cdot u = c
$$
其中$u$是$n\times 1$的执行器输出向量，$c$是$m\times 1$的期望控制量向量，$A$是$m\times n$的效用矩阵Effectiveness matrix，它描述每个轴上各执行器的效用。

对于$n>m$的冗余系统，求解$A$的Moore-Penrose伪逆（代码位于`src/lib/matrix/matrix/PseudoInverse.hpp`），则待求的控制量为
$$
u = A^+ \cdot c
$$

代码中实际除了计算它，还进行了归一化。计算流程为：
- 判断是否开启了roll/pitch/yaw的归一化（对于四旋翼默认是开启的），如果开启则进行下一步；
- 分别统计roll和pitch生效的执行器数量
- 分别计算roll和pitch的正则化scale：
  $$
  scale=\sqrt\frac{\sum_n mix_n^2}{n^*/2}
  $$
  其中$n^*$表示该轴（roll/pitch）生效的执行器数量，$mix_n$为伪逆矩阵中该轴上不同执行器的权重。这相当于在该轴上计算伪逆矩阵的均方根作为scale。分母除以2是把每个执行器作为正负两个方向来看待。
- 取roll和pitch中较大的scale作为两个轴统一的scale
- 取伪逆矩阵在yaw轴上的最大值作为yaw轴的scale
- 对剩下的每个轴（三个方向的油门，对于四旋翼只有Z方向的油门），scale取该轴伪逆矩阵绝对值的平均。
- 最后每个轴除以scale完成归一化。

归一化的目的是统一各轴的控制灵敏度。

最后用下式计算输出，`_mix`是归一化后的伪逆矩阵：
```c++
_actuator_sp = _actuator_trim + _mix * (_control_sp - _control_trim);
```

### 序列抗饱和控制分配器

序列抗饱和控制分配器是在伪逆法的基础上增加了序列抗饱和算法。分为三个airmode，通过参数`MC_AIRMODE`控制。Airmode允许在油门很大或很小时调整油门以保证对俯仰和滚转的控制。

#### 禁用

禁用Airmode为飞行器实现默认的控制分配。

首先计算`_actuator_sp`，相比伪逆法这里没有计算yaw:
```c++
_actuator_sp(i) = _actuator_trim(i) +
      _mix(i, ControlAxis::ROLL) * (_control_sp(ControlAxis::ROLL) - _control_trim(ControlAxis::ROLL)) +
      _mix(i, ControlAxis::PITCH) * (_control_sp(ControlAxis::PITCH) - _control_trim(ControlAxis::PITCH)) +
      _mix(i, ControlAxis::THRUST_X) * (_control_sp(ControlAxis::THRUST_X) - _control_trim(ControlAxis::THRUST_X)) +
      _mix(i, ControlAxis::THRUST_Y) * (_control_sp(ControlAxis::THRUST_Y) - _control_trim(ControlAxis::THRUST_Y)) +
      _mix(i, ControlAxis::THRUST_Z) * (_control_sp(ControlAxis::THRUST_Z) - _control_trim(ControlAxis::THRUST_Z));
```

接下来调用`desaturateActuators`对z轴推力、滚转和俯仰分别进行抗饱和处理，其中z轴推力只允许减小。具体的抗饱和函数为：
```c++
void ControlAllocationSequentialDesaturation::desaturateActuators(
	ActuatorVector &actuator_sp,
	const ActuatorVector &desaturation_vector, bool increase_only)
{
	float gain = computeDesaturationGain(desaturation_vector, actuator_sp);

	if (increase_only && gain < 0.f) {
		return;
	}

	for (int i = 0; i < _num_actuators; i++) {
		actuator_sp(i) += gain * desaturation_vector(i);
	}

	gain = 0.5f * computeDesaturationGain(desaturation_vector, actuator_sp);

	for (int i = 0; i < _num_actuators; i++) {
		actuator_sp(i) += gain * desaturation_vector(i);
	}
}
```
其流程可以概括为向着`desaturation_vector`的方向调整两次，第一次为粗调，第二次将增益减半（不是第一次的增益减半，而是重新计算增益后再减半）再细调，有点类似变学习率的梯度下降的感觉。其中增益的计算为：
```c++
float ControlAllocationSequentialDesaturation::computeDesaturationGain(const ActuatorVector &desaturation_vector,
		const ActuatorVector &actuator_sp)
{
	float k_min = 0.f;
	float k_max = 0.f;

	for (int i = 0; i < _num_actuators; i++) {
		// Do not use try to desaturate using an actuator with weak effectiveness to avoid large desaturation gains
		if (fabsf(desaturation_vector(i)) < 0.2f) {
			continue;
		}

		if (actuator_sp(i) < _actuator_min(i)) {
			float k = (_actuator_min(i) - actuator_sp(i)) / desaturation_vector(i);

			if (k < k_min) { k_min = k; }

			if (k > k_max) { k_max = k; }
		}

		if (actuator_sp(i) > _actuator_max(i)) {
			float k = (_actuator_max(i) - actuator_sp(i)) / desaturation_vector(i);

			if (k < k_min) { k_min = k; }

			if (k > k_max) { k_max = k; }
		}
	}

	// Reduce the saturation as much as possible
	return k_min + k_max;
}
```
首先遍历执行器，计算要让它回到非饱和的范围需要的增益（可正可负）。然而，可能存在的情况是有些执行器需要正增益而有些需要负增益，如果只按照一个方向调整则另一个方向的会变得更糟，因此算法最后返回最大值与最小值的和，以求得二者之间的折衷，配合上面的粗细两次调整来实现工程上更好的抗饱和，尽管可能不是数学上最优的解。

最后通过`mixYaw`来混入偏航：

```c++
void
ControlAllocationSequentialDesaturation::mixYaw()
{
	// Add yaw to outputs
	ActuatorVector yaw;
	ActuatorVector thrust_z;

	for (int i = 0; i < _num_actuators; i++) {
		_actuator_sp(i) += _mix(i, ControlAxis::YAW) * (_control_sp(ControlAxis::YAW) - _control_trim(ControlAxis::YAW));
		yaw(i) = _mix(i, ControlAxis::YAW);
		thrust_z(i) = _mix(i, ControlAxis::THRUST_Z);
	}

	// Change yaw acceleration to unsaturate the outputs if needed (do not change roll/pitch),
	// and allow some yaw response at maximum thrust
	ActuatorVector max_prev = _actuator_max;
	_actuator_max += (_actuator_max - _actuator_min) * MINIMUM_YAW_MARGIN;
	desaturateActuators(_actuator_sp, yaw);
	_actuator_max = max_prev;

	// reduce thrust only
	desaturateActuators(_actuator_sp, thrust_z, true);
}
```

代码首先将偏航加入`_actuator_sp`，然后将`_actuator_max`临时扩大一点（`MINIMUM_YAW_MARGIN=0.15`）来计算yaw的抗饱和，由于放宽了执行器上限，可以有更多的裕量来执行偏航。最后再次执行z轴推力的抗饱和以修正放宽上限的影响，即相当于通过减少z轴推力的控制裕量来补偿偏航。

#### RP模式

此时允许增加推力以保证对俯仰和滚转的控制能力。不对俯仰和滚转执行抗饱和，从而保证这两者最大的控制能力。

#### RPY模式

用偏航抗饱和代替`mixYaw`，对偏航的控制能力可能更弱（因为缺少了用推力补偿偏航裕量的调整）。

## 效用矩阵

多旋翼的效用矩阵由`src/modules/control_allocator/VehicleActuatorEffectiveness/ActuatorEffectivenessMultirotor.cpp`中的`getEffectivenessMatrix`提供，而实际上的计算过程位于`src/modules/control_allocator/VehicleActuatorEffectiveness/ActuatorEffectivenessRotors.cpp`的`computeEffectivenessMatrix`函数。这里给出最核心的代码：
```c++
// ...

// Get rotor axis
Vector3f axis = geometry.rotors[i].axis;

// ...归一化axis

// Get rotor position
const Vector3f &position = geometry.rotors[i].position;

// Get coefficients
float ct = geometry.rotors[i].thrust_coef;
float km = geometry.rotors[i].moment_ratio;

// Compute thrust generated by this rotor
matrix::Vector3f thrust = ct * axis;

// Compute moment generated by this rotor
matrix::Vector3f moment = ct * position.cross(axis) - ct * km * axis;

// Fill corresponding items in effectiveness matrix
for (size_t j = 0; j < 3; j++) {
  effectiveness(j, i + actuator_start_index) = moment(j);
  effectiveness(j + 3, i + actuator_start_index) = thrust(j);
}

// ...
```
其中的position, ct, km, axis等参数通过`CA_ROTORx_*`参数设置，`x`为电机编号。

## 电调输出

`control_allocation`模块发布执行器setpoint到`actuator_motors`话题上，这一话题又被`mixer_module`订阅，具体代码位于`src/lib/mixer_module/functions/FunctionMotors.hpp`。这里给出大概的流程和代码位置，方便查找：

- `src/drivers/dshot/DShot.cpp`或`src/drivers/pwm_out/PWMOut.cpp`等，在`Run`函数中调用`src/lib/mixer_module/mixer_module.cpp`的`MixingOutput::update`
- `MixingOutput::update`中调用各function的`update`，我们主要关心的是`FunctionMotors`也就是`src/lib/mixer_module/functions/FunctionMotors.hpp`中的`update`，它从`actuator_motors`话题接受执行器setpoint
- `FunctionMotors::update`调用`FunctionMotors::updateValues`，这里解了一个一元二次方程：$T=fu^2+(1-f)u$，其中$T\in[0,1]$是传入的setpoint，$u\in[0,1]$是实际的相对setpoint，$f$是参数`THR_MDL_FAC`。这里处理推力大小与电调转速大小的非线性关系，默认$f=0$。之后，又将其映射到$[-1,1]$。
- `MixingOutput::update`继续调用`MixingOutput::limitAndUpdateOutputs->MixingOutput::output_limit_calc->MixingOutput::output_limit_calc_single`，这里将其插值到参数`xxx_MINn`和`xxx_MAXn`之间。其中`xxx`为参数前缀，取决于输出驱动，如Dshot就通过`src/drivers/dshot/CMakeLists.txt`定义了前缀为`PWM_MAIN`。`n`为执行器编号(1~8)。例如`PWM_MAIN_MIN1`。

以上就是从$[0,1]$之间的相对推力值到实际电调协议值的大致过程。
