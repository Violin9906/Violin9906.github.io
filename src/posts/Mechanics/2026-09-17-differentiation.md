---
icon: pen-to-square
date: 2026-09-17
author: ChatGPT
tag:
  - Robotics
  - Mechanics
  - Lie-Group
  - Kinematics
---

# 刚体运动学与微分公式速查

## 约定

本文统一采用：

- 旋转矩阵 $\mathbf R\in SO(3)$ 表示从**刚体系到世界系**的主动旋转；
- 四元数采用 Hamilton convention，标量在前：

$$
\mathbf q=
\begin{bmatrix}
w\\
\mathbf v
\end{bmatrix}
=
\begin{bmatrix}
w&x&y&z
\end{bmatrix}^\top
$$

- 四元数与旋转矩阵满足

$$
\mathbf q\otimes \mathbf a\otimes\mathbf q^*
\quad\Longleftrightarrow\quad
\mathbf R\mathbf a
$$

其中向量 $\mathbf a\in\mathbb R^3$ 在四元数运算中视作纯四元数

$$
\mathbf a_q=
\begin{bmatrix}
0\\
\mathbf a
\end{bmatrix}.
$$

- 叉乘矩阵记为

$$
[\mathbf a]_\times
=
\begin{bmatrix}
0&-a_3&a_2\\
a_3&0&-a_1\\
-a_2&a_1&0
\end{bmatrix}
$$

满足

$$
[\mathbf a]_\times\mathbf b
=
\mathbf a\times\mathbf b.
$$

:::info
不同教材、软件和论文可能采用不同约定，例如：

- 四元数标量在前或在后；
- Hamilton 或 JPL 四元数；
- $\mathbf R$ 表示 body-to-world 或 world-to-body；
- twist 排列为 $[\omega;v]$ 或 $[v;\omega]$。

这些约定会改变部分公式的正负号和矩阵排列。使用公式前应首先确认约定。
:::

## 向量与叉乘矩阵

### 常用恒等式

$$
[\mathbf a]_\times^\top
=
-[\mathbf a]_\times
$$

$$
[\mathbf a]_\times\mathbf b
=
-[\mathbf b]_\times\mathbf a
$$

$$
[\mathbf a]_\times^2
=
\mathbf a\mathbf a^\top
-
\|\mathbf a\|^2\mathbf I
$$

$$
[\mathbf a]_\times[\mathbf b]_\times
=
\mathbf b\mathbf a^\top
-
(\mathbf a^\top\mathbf b)\mathbf I
$$

对于旋转矩阵：

$$
[\mathbf R\mathbf a]_\times
=
\mathbf R[\mathbf a]_\times\mathbf R^\top
$$

因此

$$
\mathbf R[\mathbf a]_\times
=
[\mathbf R\mathbf a]_\times\mathbf R.
$$

### 常用微分

对于

$$
\mathbf y=\mathbf a\times\mathbf b
$$

有

$$
\delta\mathbf y
=
-[\mathbf b]_\times\delta\mathbf a
+
[\mathbf a]_\times\delta\mathbf b.
$$

因此

$$
\frac{\partial(\mathbf a\times\mathbf b)}
{\partial\mathbf a}
=
-[\mathbf b]_\times
$$

$$
\frac{\partial(\mathbf a\times\mathbf b)}
{\partial\mathbf b}
=
[\mathbf a]_\times.
$$

## 旋转矩阵

旋转矩阵满足

$$
\mathbf R^\top\mathbf R
=
\mathbf R\mathbf R^\top
=
\mathbf I
$$

以及

$$
\det\mathbf R=1.
$$

因此

$$
\mathbf R^{-1}
=
\mathbf R^\top.
$$

有限旋转通常不可交换：

$$
\mathbf R_1\mathbf R_2
\neq
\mathbf R_2\mathbf R_1.
$$

### 轴角与指数映射

旋转向量定义为

$$
\boldsymbol\phi
=
\theta\mathbf u
$$

其中

$$
\|\mathbf u\|=1.
$$

旋转矩阵可以写为

$$
\mathbf R
=
\operatorname{Exp}(\boldsymbol\phi)
=
\exp([\boldsymbol\phi]_\times).
$$

Rodrigues公式：

$$
\mathbf R
=
\mathbf I
+
\frac{\sin\theta}{\theta}
[\boldsymbol\phi]_\times
+
\frac{1-\cos\theta}{\theta^2}
[\boldsymbol\phi]_\times^2.
$$

若直接使用单位旋转轴 $\mathbf u$：

$$
\mathbf R
=
\mathbf I
+
\sin\theta[\mathbf u]_\times
+
(1-\cos\theta)[\mathbf u]_\times^2.
$$

### 旋转矩阵对旋转角的导数

对于固定旋转轴 $\mathbf u$：

$$
\mathbf R(\theta)
=
\operatorname{Exp}(\theta\mathbf u)
$$

有

$$
\boxed{
\frac{\partial\mathbf R}{\partial\theta}
=
\mathbf R[\mathbf u]_\times
=
[\mathbf u]_\times\mathbf R
}
$$

并且

$$
\frac{\partial^n\mathbf R}
{\partial\theta^n}
=
\mathbf R[\mathbf u]_\times^n.
$$

### 旋转矩阵的时间导数

#### 角速度在刚体系表示

记刚体系角速度为 $\boldsymbol\omega_b$：

$$
\boxed{
\dot{\mathbf R}
=
\mathbf R[\boldsymbol\omega_b]_\times
}
$$

因此

$$
\boxed{
[\boldsymbol\omega_b]_\times
=
\mathbf R^\top\dot{\mathbf R}
}
$$

#### 角速度在世界系表示

记世界系角速度为 $\boldsymbol\omega_s$：

$$
\boxed{
\dot{\mathbf R}
=
[\boldsymbol\omega_s]_\times\mathbf R
}
$$

因此

$$
\boxed{
[\boldsymbol\omega_s]_\times
=
\dot{\mathbf R}\mathbf R^\top
}
$$

两者满足

$$
\boxed{
\boldsymbol\omega_s
=
\mathbf R\boldsymbol\omega_b
}
$$

#### 二阶时间导数

刚体系表示：

$$
\boxed{
\ddot{\mathbf R}
=
\mathbf R
\left(
[\boldsymbol\alpha_b]_\times
+
[\boldsymbol\omega_b]_\times^2
\right)
}
$$

世界系表示：

$$
\boxed{
\ddot{\mathbf R}
=
\left(
[\boldsymbol\alpha_s]_\times
+
[\boldsymbol\omega_s]_\times^2
\right)\mathbf R
}
$$

其中

$$
\boldsymbol\alpha=\dot{\boldsymbol\omega}.
$$

### 旋转矩阵作用于向量

设

$$
\mathbf y
=
\mathbf R\mathbf a.
$$

对 $\mathbf a$ 求导：

$$
\boxed{
\frac{\partial(\mathbf R\mathbf a)}
{\partial\mathbf a}
=
\mathbf R
}
$$

如果 $\mathbf a$ 固连于刚体，则

$$
\dot{\mathbf y}
=
\dot{\mathbf R}\mathbf a
=
\mathbf R
(\boldsymbol\omega_b\times\mathbf a)
$$

或

$$
\boxed{
\dot{\mathbf y}
=
\boldsymbol\omega_s\times\mathbf y
}
$$

二阶导数：

$$
\ddot{\mathbf y}
=
\boldsymbol\alpha_s\times\mathbf y
+
\boldsymbol\omega_s
\times
(\boldsymbol\omega_s\times\mathbf y).
$$

### 微小旋转扰动

#### 右扰动：局部/刚体系扰动

定义

$$
\mathbf R'
=
\mathbf R\operatorname{Exp}(\delta\boldsymbol\theta).
$$

对于小量：

$$
\operatorname{Exp}(\delta\boldsymbol\theta)
\approx
\mathbf I
+
[\delta\boldsymbol\theta]_\times.
$$

因此

$$
\delta(\mathbf R\mathbf a)
=
-\mathbf R[\mathbf a]_\times
\delta\boldsymbol\theta.
$$

所以

$$
\boxed{
\frac{\partial(\mathbf R\mathbf a)}
{\partial\delta\boldsymbol\theta}
=
-\mathbf R[\mathbf a]_\times
}
$$

#### 左扰动：世界系扰动

定义

$$
\mathbf R'
=
\operatorname{Exp}(\delta\boldsymbol\theta)\mathbf R.
$$

则

$$
\delta(\mathbf R\mathbf a)
=
-[\mathbf R\mathbf a]_\times
\delta\boldsymbol\theta.
$$

因此

$$
\boxed{
\frac{\partial(\mathbf R\mathbf a)}
{\partial\delta\boldsymbol\theta}
=
-[\mathbf R\mathbf a]_\times
}
$$

:::info
右扰动的增量 $\delta\boldsymbol\theta$ 通常在**刚体系**表达；

左扰动的增量 $\delta\boldsymbol\theta$ 通常在**世界系**表达。

状态估计、误差状态卡尔曼滤波和李群优化中必须明确使用的是哪一种扰动定义。
:::

### SO(3) 左、右 Jacobian

对于

$$
\boldsymbol\phi\in\mathbb R^3,
\qquad
\theta=\|\boldsymbol\phi\|
$$

右 Jacobian 为

$$
\boxed{
\mathbf J_r(\boldsymbol\phi)
=
\mathbf I
-
\frac{1-\cos\theta}{\theta^2}
[\boldsymbol\phi]_\times
+
\frac{\theta-\sin\theta}{\theta^3}
[\boldsymbol\phi]_\times^2
}
$$

左 Jacobian 为

$$
\boxed{
\mathbf J_l(\boldsymbol\phi)
=
\mathbf I
+
\frac{1-\cos\theta}{\theta^2}
[\boldsymbol\phi]_\times
+
\frac{\theta-\sin\theta}{\theta^3}
[\boldsymbol\phi]_\times^2
}
$$

二者满足

$$
\mathbf J_l(\boldsymbol\phi)
=
\mathbf J_r(-\boldsymbol\phi).
$$

对于小角度：

$$
\mathbf J_r
\approx
\mathbf I
-\frac12[\boldsymbol\phi]_\times
+\frac16[\boldsymbol\phi]_\times^2
$$

$$
\mathbf J_l
\approx
\mathbf I
+\frac12[\boldsymbol\phi]_\times
+\frac16[\boldsymbol\phi]_\times^2.
$$

### Exp 对旋转向量的微分

如果

$$
\mathbf R(\boldsymbol\phi)
=
\operatorname{Exp}(\boldsymbol\phi)
$$

则

$$
\operatorname{Exp}(\boldsymbol\phi+\delta\boldsymbol\phi)
\approx
\operatorname{Exp}(\boldsymbol\phi)
\operatorname{Exp}
\left(
\mathbf J_r(\boldsymbol\phi)
\delta\boldsymbol\phi
\right).
$$

因此

$$
\boxed{
\delta(\mathbf R\mathbf a)
=
-\mathbf R[\mathbf a]_\times
\mathbf J_r(\boldsymbol\phi)
\delta\boldsymbol\phi
}
$$

即

$$
\boxed{
\frac{\partial(\mathbf R\mathbf a)}
{\partial\boldsymbol\phi}
=
-\mathbf R[\mathbf a]_\times
\mathbf J_r(\boldsymbol\phi)
}
$$

这就是状态估计和机器人优化中非常常见的旋转向量 Jacobian。

## 四元数

单位四元数

$$
\mathbf q=
\begin{bmatrix}
w\\
\mathbf v
\end{bmatrix}
$$

满足

$$
w^2+\mathbf v^\top\mathbf v=1.
$$

轴角对应关系为

$$
w
=
\cos\frac{\theta}{2}
$$

$$
\mathbf v
=
\mathbf u\sin\frac{\theta}{2}.
$$

### 四元数共轭和逆

$$
\mathbf q^*
=
\begin{bmatrix}
w\\
-\mathbf v
\end{bmatrix}
$$

单位四元数满足

$$
\boxed{
\mathbf q^{-1}
=
\mathbf q^*
}
$$

以及

$$
\mathbf q\otimes\mathbf q^*
=
\begin{bmatrix}
1\\
\mathbf0
\end{bmatrix}.
$$

### 四元数乘法

设

$$
\mathbf q=
\begin{bmatrix}
w\\
\mathbf v
\end{bmatrix},
\qquad
\mathbf p=
\begin{bmatrix}
s\\
\mathbf u
\end{bmatrix}
$$

则

$$
\boxed{
\mathbf q\otimes\mathbf p
=
\begin{bmatrix}
ws-\mathbf v^\top\mathbf u\\
w\mathbf u+s\mathbf v+\mathbf v\times\mathbf u
\end{bmatrix}
}
$$

左乘矩阵：

$$
\mathbf q\otimes\mathbf p
=
\mathbf L(\mathbf q)\mathbf p
$$

其中

$$
\mathbf L(\mathbf q)
=
\begin{bmatrix}
w&-\mathbf v^\top\\
\mathbf v&w\mathbf I+[\mathbf v]_\times
\end{bmatrix}.
$$

右乘矩阵：

$$
\mathbf q\otimes\mathbf p
=
\mathbf R_q(\mathbf p)\mathbf q
$$

也可以定义

$$
\mathbf p\otimes\mathbf q
=
\mathbf R(\mathbf q)\mathbf p
$$

其中常用的四元数右乘矩阵为

$$
\mathbf R_q(\mathbf q)
=
\begin{bmatrix}
w&-\mathbf v^\top\\
\mathbf v&w\mathbf I-[\mathbf v]_\times
\end{bmatrix}.
$$

:::warning
这里的四元数右乘矩阵 $\mathbf R_q$ 与旋转矩阵 $\mathbf R\in SO(3)$ 不应混淆。
:::

### 四元数与旋转矩阵

由单位四元数得到旋转矩阵：

$$
\boxed{
\mathbf R(\mathbf q)
=
(w^2-\mathbf v^\top\mathbf v)\mathbf I
+
2\mathbf v\mathbf v^\top
+
2w[\mathbf v]_\times
}
$$

等价地：

$$
\mathbf R
=
\mathbf I
+
2w[\mathbf v]_\times
+
2[\mathbf v]_\times^2.
$$

向量旋转：

$$
\boxed{
\mathbf q\otimes
\begin{bmatrix}
0\\
\mathbf a
\end{bmatrix}
\otimes\mathbf q^*
=
\begin{bmatrix}
0\\
\mathbf R\mathbf a
\end{bmatrix}
}
$$

### 四元数对时间的微分

#### 角速度在刚体系表示

$$
\boxed{
\dot{\mathbf q}
=
\frac12
\mathbf q\otimes
\begin{bmatrix}
0\\
\boldsymbol\omega_b
\end{bmatrix}
}
$$

即

$$
\dot{\mathbf q}
=
\frac12
\begin{bmatrix}
-\mathbf v^\top\\
w\mathbf I+[\mathbf v]_\times
\end{bmatrix}
\boldsymbol\omega_b.
$$

反过来：

$$
\boxed{
\boldsymbol\omega_b
=
2
\begin{bmatrix}
-\mathbf v&
w\mathbf I-[\mathbf v]_\times
\end{bmatrix}
\dot{\mathbf q}
}
$$

这就是 Shabana 中

$$
\boldsymbol\omega
=
\mathbf G(\mathbf q)\dot{\mathbf q}
$$

形式在当前四元数约定下的具体表达。

#### 角速度在世界系表示

$$
\boxed{
\dot{\mathbf q}
=
\frac12
\begin{bmatrix}
0\\
\boldsymbol\omega_s
\end{bmatrix}
\otimes\mathbf q
}
$$

即

$$
\dot{\mathbf q}
=
\frac12
\begin{bmatrix}
-\mathbf v^\top\\
w\mathbf I-[\mathbf v]_\times
\end{bmatrix}
\boldsymbol\omega_s.
$$

因此

$$
\boxed{
\boldsymbol\omega_s
=
2
\begin{bmatrix}
-\mathbf v&
w\mathbf I+[\mathbf v]_\times
\end{bmatrix}
\dot{\mathbf q}
}
$$

### 四元数旋转对变量的 Jacobian

设

$$
\mathbf y
=
\mathbf q\otimes\mathbf a\otimes\mathbf q^*
=
\mathbf R(\mathbf q)\mathbf a.
$$

对 $\mathbf a$ 求导：

$$
\boxed{
\frac{\partial\mathbf y}
{\partial\mathbf a}
=
\mathbf R
}
$$

对四元数

$$
\mathbf q=
\begin{bmatrix}
w\\
\mathbf v
\end{bmatrix}
$$

求导：

$$
\boxed{
\frac{\partial(\mathbf R\mathbf a)}
{\partial\mathbf q}
=
2
\begin{bmatrix}
w\mathbf a+\mathbf v\times\mathbf a
&
(\mathbf v^\top\mathbf a)\mathbf I
+\mathbf v\mathbf a^\top
-\mathbf a\mathbf v^\top
-w[\mathbf a]_\times
\end{bmatrix}
}
$$

其维数为

$$
3\times4.
$$

:::info
四元数只有3个实际旋转自由度，因此直接对4维四元数求导时存在单位模约束。

在优化、ESKF和李群状态估计中，通常更推荐对3维的小旋转扰动 $\delta\boldsymbol\theta$ 求导，而不是直接把四元数4个分量当成独立变量。
:::

### 四元数小扰动

小旋转

$$
\delta\boldsymbol\theta
$$

对应四元数近似为

$$
\delta\mathbf q
\approx
\begin{bmatrix}
1\\
\frac12\delta\boldsymbol\theta
\end{bmatrix}.
$$

右扰动：

$$
\boxed{
\mathbf q'
=
\mathbf q\otimes\delta\mathbf q
}
$$

对应局部/刚体系误差。

左扰动：

$$
\boxed{
\mathbf q'
=
\delta\mathbf q\otimes\mathbf q
}
$$

对应世界系误差。

## 欧拉角

常见航空 ZYX 形式：

$$
\mathbf R
=
\mathbf R_z(\psi)
\mathbf R_y(\theta)
\mathbf R_x(\phi)
$$

其中

- $\phi$：roll；
- $\theta$：pitch；
- $\psi$：yaw。

角速度一般不能直接写成

$$
\boldsymbol\omega
=
\begin{bmatrix}
\dot\phi\\
\dot\theta\\
\dot\psi
\end{bmatrix}.
$$

而是

$$
\boxed{
\boldsymbol\omega
=
\mathbf G(\phi,\theta,\psi)
\dot{\boldsymbol\eta}
}
$$

其中

$$
\boldsymbol\eta
=
\begin{bmatrix}
\phi\\
\theta\\
\psi
\end{bmatrix}.
$$

:::warning
三参数欧拉角表示必然存在奇异位形。

例如 ZYX 欧拉角在

$$
\theta=\pm\frac{\pi}{2}
$$

附近发生奇异。

因此动力学、优化和状态估计内部通常优先采用旋转矩阵、四元数或李群表示。
:::

## SO(3) 对数映射

对于

$$
\mathbf R\in SO(3)
$$

定义

$$
\boldsymbol\phi
=
\operatorname{Log}(\mathbf R)^\vee.
$$

旋转角：

$$
\theta
=
\cos^{-1}
\left(
\frac{\operatorname{tr}(\mathbf R)-1}{2}
\right).
$$

在非奇异情况下：

$$
\boxed{
\boldsymbol\phi
=
\frac{\theta}{2\sin\theta}
(\mathbf R-\mathbf R^\top)^\vee
}
$$

其中 $\vee$ 为反对称矩阵到向量的映射：

$$
[\mathbf a]_\times^\vee
=
\mathbf a.
$$

## SE(3) 齐次变换

刚体位姿：

$$
\mathbf T
=
\begin{bmatrix}
\mathbf R&\mathbf p\\
\mathbf0^\top&1
\end{bmatrix}
\in SE(3).
$$

对点 $\mathbf a$：

$$
\boxed{
\mathbf x
=
\mathbf R\mathbf a+\mathbf p
}
$$

齐次形式：

$$
\begin{bmatrix}
\mathbf x\\
1
\end{bmatrix}
=
\mathbf T
\begin{bmatrix}
\mathbf a\\
1
\end{bmatrix}.
$$

逆变换：

$$
\boxed{
\mathbf T^{-1}
=
\begin{bmatrix}
\mathbf R^\top&
-\mathbf R^\top\mathbf p\\
0&1
\end{bmatrix}
}
$$

## Twist 与 se(3)

本文采用

$$
\boldsymbol\xi
=
\begin{bmatrix}
\boldsymbol\omega\\
\mathbf v
\end{bmatrix}
\in\mathbb R^6.
$$

hat 运算：

$$
\boxed{
\boldsymbol\xi^\wedge
=
\begin{bmatrix}
[\boldsymbol\omega]_\times&\mathbf v\\
\mathbf0^\top&0
\end{bmatrix}
}
$$

## 位姿的时间导数

### 刚体系 twist

如果

$$
\boldsymbol\xi_b
=
\begin{bmatrix}
\boldsymbol\omega_b\\
\mathbf v_b
\end{bmatrix}
$$

则

$$
\boxed{
\dot{\mathbf T}
=
\mathbf T\boldsymbol\xi_b^\wedge
}
$$

因此

$$
\boxed{
\boldsymbol\xi_b^\wedge
=
\mathbf T^{-1}\dot{\mathbf T}
}
$$

### 世界系 twist

如果

$$
\boldsymbol\xi_s
=
\begin{bmatrix}
\boldsymbol\omega_s\\
\mathbf v_s
\end{bmatrix}
$$

则

$$
\boxed{
\dot{\mathbf T}
=
\boldsymbol\xi_s^\wedge\mathbf T
}
$$

因此

$$
\boxed{
\boldsymbol\xi_s^\wedge
=
\dot{\mathbf T}\mathbf T^{-1}
}
$$

## 伴随矩阵

### 李群伴随矩阵 Ad

设

$$
\mathbf T
=
\begin{bmatrix}
\mathbf R&\mathbf p\\
0&1
\end{bmatrix}
$$

对于

$$
\boldsymbol\xi=
\begin{bmatrix}
\boldsymbol\omega\\
\mathbf v
\end{bmatrix}
$$

其伴随矩阵为

$$
\boxed{
\operatorname{Ad}_{\mathbf T}
=
\begin{bmatrix}
\mathbf R&\mathbf0\\
[\mathbf p]_\times\mathbf R&\mathbf R
\end{bmatrix}
}
$$

用于不同坐标系之间转换 twist：

$$
\boxed{
\boldsymbol\xi_s
=
\operatorname{Ad}_{\mathbf T}
\boldsymbol\xi_b
}
$$

逆关系：

$$
\boxed{
\boldsymbol\xi_b
=
\operatorname{Ad}_{\mathbf T^{-1}}
\boldsymbol\xi_s
}
$$

伴随满足

$$
\operatorname{Ad}_{\mathbf T_1\mathbf T_2}
=
\operatorname{Ad}_{\mathbf T_1}
\operatorname{Ad}_{\mathbf T_2}.
$$

### 李代数伴随矩阵 ad

对于

$$
\boldsymbol\xi=
\begin{bmatrix}
\boldsymbol\omega\\
\mathbf v
\end{bmatrix}
$$

定义

$$
\boxed{
\operatorname{ad}_{\boldsymbol\xi}
=
\begin{bmatrix}
[\boldsymbol\omega]_\times&\mathbf0\\
[\mathbf v]_\times&[\boldsymbol\omega]_\times
\end{bmatrix}
}
$$

满足

$$
[\boldsymbol\xi_1^\wedge,\boldsymbol\xi_2^\wedge]
=
\left(
\operatorname{ad}_{\boldsymbol\xi_1}
\boldsymbol\xi_2
\right)^\wedge.
$$

即

$$
\operatorname{ad}_{\boldsymbol\xi_1}\boldsymbol\xi_2
$$

对应两个 twist 的 Lie bracket。

## Wrench 的坐标变换

采用

$$
\mathbf F
=
\begin{bmatrix}
\boldsymbol\tau\\
\mathbf f
\end{bmatrix}.
$$

为了保持功率

$$
\mathbf F^\top\boldsymbol\xi
$$

在坐标变换下不变，wrench 使用 twist 的对偶变换：

$$
\boxed{
\mathbf F_s
=
\operatorname{Ad}_{\mathbf T}^{-T}
\mathbf F_b
}
$$

反之

$$
\boxed{
\mathbf F_b
=
\operatorname{Ad}_{\mathbf T}^{T}
\mathbf F_s
}
$$

:::info
这就是 Featherstone Spatial Vector Algebra 中：

- spatial motion vector；
- spatial force vector；

采用不同变换规律的根本原因。
:::

## 点速度与刚体 Jacobian

若刚体上的固定点 $\mathbf a$ 在世界系位置为

$$
\mathbf x
=
\mathbf p+\mathbf R\mathbf a
$$

则

$$
\dot{\mathbf x}
=
\dot{\mathbf p}
+
\boldsymbol\omega_s
\times
(\mathbf R\mathbf a).
$$

因此

$$
\boxed{
\dot{\mathbf x}
=
\mathbf v_O
-
[\mathbf R\mathbf a]_\times
\boldsymbol\omega_s
}
$$

若 twist 排列为

$$
\mathbf V=
\begin{bmatrix}
\mathbf v_O\\
\boldsymbol\omega_s
\end{bmatrix}
$$

则点速度 Jacobian 为

$$
\boxed{
\dot{\mathbf x}
=
\begin{bmatrix}
\mathbf I&
-[\mathbf R\mathbf a]_\times
\end{bmatrix}
\mathbf V
}
$$

## 刚体点加速度

对于刚体固定点：

$$
\boxed{
\ddot{\mathbf x}
=
\mathbf a_O
+
\boldsymbol\alpha
\times\mathbf r
+
\boldsymbol\omega
\times
(\boldsymbol\omega\times\mathbf r)
}
$$

其中

$$
\mathbf r
=
\mathbf R\mathbf a.
$$

三项分别为：

- 参考点平动加速度；
- 切向加速度；
- 向心加速度。

## 惯性张量的坐标变换

若刚体系惯性张量为

$$
\mathbf I_b
$$

则世界系表示为

$$
\boxed{
\mathbf I_s
=
\mathbf R\mathbf I_b\mathbf R^\top
}
$$

时间导数：

$$
\boxed{
\dot{\mathbf I}_s
=
[\boldsymbol\omega_s]_\times\mathbf I_s
-
\mathbf I_s[\boldsymbol\omega_s]_\times
}
$$

因此角动量

$$
\mathbf H
=
\mathbf I_s\boldsymbol\omega_s
$$

满足

$$
\boldsymbol\tau
=
\dot{\mathbf H}.
$$

在刚体系中则得到经典 Euler 方程：

$$
\boxed{
\boldsymbol\tau_b
=
\mathbf I_b\dot{\boldsymbol\omega}_b
+
\boldsymbol\omega_b
\times
(\mathbf I_b\boldsymbol\omega_b)
}
$$

## 常用矩阵微分

逆矩阵：

$$
\boxed{
\frac{d}{dt}\mathbf A^{-1}
=
-\mathbf A^{-1}
\dot{\mathbf A}
\mathbf A^{-1}
}
$$

转置：

$$
\frac{d}{dt}\mathbf A^\top
=
\dot{\mathbf A}^\top.
$$

矩阵乘积：

$$
\frac{d}{dt}(\mathbf A\mathbf B)
=
\dot{\mathbf A}\mathbf B
+
\mathbf A\dot{\mathbf B}.
$$

二次型：

$$
f=\mathbf x^\top\mathbf A\mathbf x
$$

若 $\mathbf A$ 与 $\mathbf x$ 无关，则

$$
\boxed{
\frac{\partial f}{\partial\mathbf x}
=
(\mathbf A+\mathbf A^\top)\mathbf x
}
$$

若 $\mathbf A$ 对称：

$$
\frac{\partial f}{\partial\mathbf x}
=
2\mathbf A\mathbf x.
$$

## 向量归一化的 Jacobian

令

$$
\hat{\mathbf a}
=
\frac{\mathbf a}{\|\mathbf a\|}
$$

则

$$
\boxed{
\frac{\partial\hat{\mathbf a}}
{\partial\mathbf a}
=
\frac{1}{\|\mathbf a\|}
\left(
\mathbf I
-
\hat{\mathbf a}\hat{\mathbf a}^\top
\right)
}
$$

这个公式在：

- 构造单位旋转轴；
- 方向向量约束；
- 几何 Jacobian；
- 传感器模型；

中非常常见。

## 常用 SO(3) 微分总结

右扰动：

$$
\mathbf R'
=
\mathbf R\operatorname{Exp}(\delta\boldsymbol\theta)
$$

$$
\delta\mathbf R
=
\mathbf R[\delta\boldsymbol\theta]_\times
$$

$$
\delta(\mathbf R\mathbf a)
=
-\mathbf R[\mathbf a]_\times
\delta\boldsymbol\theta.
$$

左扰动：

$$
\mathbf R'
=
\operatorname{Exp}(\delta\boldsymbol\theta)\mathbf R
$$

$$
\delta\mathbf R
=
[\delta\boldsymbol\theta]_\times\mathbf R
$$

$$
\delta(\mathbf R\mathbf a)
=
-[\mathbf R\mathbf a]_\times
\delta\boldsymbol\theta.
$$

时间微分：

$$
\dot{\mathbf R}
=
\mathbf R[\boldsymbol\omega_b]_\times
=
[\boldsymbol\omega_s]_\times\mathbf R.
$$


## 常用四元数微分总结

向量旋转：

$$
\mathbf a_s
=
\mathbf q\otimes\mathbf a_b\otimes\mathbf q^*
$$

刚体系角速度：

$$
\boxed{
\dot{\mathbf q}
=
\frac12
\mathbf q\otimes\boldsymbol\omega_b
}
$$

世界系角速度：

$$
\boxed{
\dot{\mathbf q}
=
\frac12
\boldsymbol\omega_s\otimes\mathbf q
}
$$

其中 $\boldsymbol\omega$ 在四元数乘法中视为

$$
\begin{bmatrix}
0\\
\boldsymbol\omega
\end{bmatrix}.
$$

右小扰动：

$$
\mathbf q'
=
\mathbf q\otimes
\begin{bmatrix}
1\\
\frac12\delta\boldsymbol\theta
\end{bmatrix}.
$$

左小扰动：

$$
\mathbf q'
=
\begin{bmatrix}
1\\
\frac12\delta\boldsymbol\theta
\end{bmatrix}
\otimes\mathbf q.
$$

## 刚体上点的速度

刚体上一点

$$
\mathbf r
=
\mathbf R+\mathbf A\mathbf u
$$

的速度可以统一写成

$$
\dot{\mathbf r}
=
\dot{\mathbf R}
+
\boldsymbol\omega
\times
(\mathbf A\mathbf u).
$$

这些运动学关系是第三章建立质量矩阵、广义力和刚体动力学的基础。

## 常用的公式链

刚体姿态：

$$
\mathbf q
\leftrightarrow
\mathbf R
\leftrightarrow
\operatorname{Exp}(\boldsymbol\phi)
$$

姿态速度：

$$
\dot{\mathbf q}
\leftrightarrow
\boldsymbol\omega
\leftrightarrow
\dot{\mathbf R}
$$

其中

$$
\dot{\mathbf R}
=
\mathbf R[\boldsymbol\omega_b]_\times
$$

刚体位姿：

$$
\mathbf T\in SE(3)
$$

速度：

$$
\dot{\mathbf T}
=
\mathbf T\boldsymbol\xi_b^\wedge
$$

坐标系转换：

$$
\boldsymbol\xi_s
=
\operatorname{Ad}_{\mathbf T}
\boldsymbol\xi_b
$$

局部微分：

$$
\delta\mathbf R
=
\mathbf R[\delta\boldsymbol\theta]_\times
$$

因此

$$
\delta(\mathbf R\mathbf a)
=
-\mathbf R[\mathbf a]_\times
\delta\boldsymbol\theta.
$$

这几条公式基本贯穿：

- 刚体动力学；
- 多体动力学；
- Featherstone Spatial Vector Algebra；
- ESKF；
- SLAM；
- Lie-group state estimation；
- robot Jacobian；
- NMPC线性化；
- 连续体机器人SE(3)运动学。