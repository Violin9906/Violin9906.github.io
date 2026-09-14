---
icon: pen-to-square
date: 2026-09-13
tag:
  - Robotics
  - Automation
  - Mechanics
---

# 计算刚体动力学

## 约束、自由度和广义坐标

考虑由$n_b$个刚体构成的多体系统，选取$n$个广义坐标来描述每一个刚体的位姿。
这些广义坐标记为$\mathbf{q}=[q_1,q_2,\dots,q_n]^\top$。
在无约束的情况下，系统的自由度是$6n_b$。
然而，它们之间未必是独立的，假设它们受到$n_c<n$个形如
$$
\mathbf{C}(q_1,q_2,\dots,q_n,t)=\mathbf{C}(\mathbf{q},t)=\mathbf{0}
$$
的独立方程的约束，于是系统的自由度还剩下$(n-n_c)$个。

:::note
为什么$n$不一定等于$6n_b$？这取决于所选取的广义坐标，例如当使用四元数来描述刚体的方向时，每个刚体的位姿就有7个广义坐标，但还需要一个四元数模为1的约束方程。
:::

形如$\mathbf{C}(\mathbf{q},t)=\mathbf{0}$的约束被称为是**完整(holonomic)约束**。
如果不显含时间$t$，则称为**稳恒(scleronomic)约束**，反之则为**非稳恒(rheonomic)约束**。
在一些系统中，约束不仅与广义坐标$\mathbf{q}$有关，还与广义速度$\mathbf{\dot{q}}$有关，且无法通过积分消除掉$\mathbf{\dot{q}}$，这类约束被称为**非完整(nonholonomic)约束**。一个例子就是与地面点接触、无滑动的轮子，它可以滚去任何地方，但是速度方向却被限制。

如没有特殊说明，下面的内容只针对完整约束。

## 虚位移与广义坐标分解

虚位移$\delta \mathbf{q}$表示系统在特定时刻下、约束所允许的广义坐标发生的无穷小变化量。
对于完整约束，有
$$
\mathbf{C}_{\mathbf{q}}\delta \mathbf{q}=\mathbf{0}
$$
其中
$$
\mathbf{C}_{\mathbf{q}}=\frac{\partial \mathbf{C}(\mathbf{q},t)}{\partial \mathbf{q}}
$$
是一个$n_c \times n$的矩阵，称为**系统雅可比矩阵**。

如果约束方程线性无关，则$\mathbf{C}_{\mathbf{q}}$满秩，此时可以将广义坐标分解为
$$
\mathbf{q}=\left[\begin{matrix} \mathbf{q}_i^\top \\ \mathbf{q}_d^\top \end{matrix}\right]
$$
其中$\mathbf{q}_i$是$n-n_c$维的独立广义坐标分量，$\mathbf{q}_d$是$n_c$维的非独立广义坐标分量。
同时将$\mathbf{C}_{\mathbf{q}}$分解，得到
$$
\mathbf{C}_{\mathbf{q}_i}\delta\mathbf{q}_i + \mathbf{C}_{\mathbf{q}_d}\delta\mathbf{q}_d = \mathbf{0}
$$

## 虚功原理与广义力

假设系统受到若干外力，作用在系统中某些点上的力记为

$$
\mathbf{F}_k
$$

其作用点的位置为

$$
\mathbf{r}_k=\mathbf{r}_k(\mathbf{q},t)
$$

在虚位移 $\delta \mathbf{q}$ 下，该点产生的虚位移为

$$
\delta\mathbf{r}_k
=
\frac{\partial\mathbf{r}_k}{\partial\mathbf{q}}
\delta\mathbf{q}
$$

因此该力所做的虚功为

$$
\delta W_k
=
\mathbf{F}_k^\top\delta\mathbf{r}_k
$$

所有外力的虚功之和可以写成

$$
\delta W
=
\sum_k
\mathbf{F}_k^\top
\frac{\partial\mathbf{r}_k}{\partial\mathbf{q}}
\delta\mathbf{q}
=
\mathbf{Q}^\top\delta\mathbf{q}
$$

其中

$$
\mathbf{Q}
=
\sum_k
\left(
\frac{\partial\mathbf{r}_k}{\partial\mathbf{q}}
\right)^\top
\mathbf{F}_k
$$

称为系统的**广义力(generalized force)**。

因此，实际作用在刚体不同位置、不同方向上的力，都可以通过运动学雅可比映射为统一的广义力 $\mathbf{Q}$。

对于理想约束，约束力对所有满足约束的虚位移均不做虚功：

$$
\delta W_c=0
$$

即

$$
\mathbf{Q}_c^\top\delta\mathbf{q}=0
$$

而允许虚位移满足

$$
\mathbf{C}_{\mathbf q}\delta\mathbf q=0
$$

因此约束广义力必然位于 $\mathbf{C}_{\mathbf q}^\top$ 的列空间中，可以使用拉格朗日乘子表示。

## 第二类拉格朗日方程

对于使用独立广义坐标描述的系统，可以通过系统的动能

$$
T=T(\mathbf{q},\dot{\mathbf{q}},t)
$$

建立第二类拉格朗日方程：

$$
\frac{d}{dt}
\left(
\frac{\partial T}{\partial\dot{\mathbf{q}}}
\right)
-
\frac{\partial T}{\partial\mathbf{q}}
=
\mathbf{Q}
$$

其中 $\mathbf{Q}$ 为作用在系统上的总广义力。

这里使用的是动能 $T$ 而不是拉格朗日量

$$
L=T-V
$$

因为势能力也可以直接写成广义力。例如对于势能 $P(\mathbf q)$，

$$
\mathbf{Q}_P
=
-\frac{\partial P}{\partial\mathbf q}
$$

因此

$$
\frac{d}{dt}
\left(
\frac{\partial T}{\partial\dot{\mathbf{q}}}
\right)
-
\frac{\partial T}{\partial\mathbf{q}}
=
\mathbf{Q}_P+\mathbf{Q}_{其他}
$$

与使用 $L=T-P$ 的形式完全等价。

这种写法的优点是，可以将重力、弹簧力、阻尼力、电机驱动力、接触力等统一写入广义力 $\mathbf Q$，更适合通用多体动力学程序。

将拉格朗日方程进一步整理，一般可以得到

$$
\mathbf{M}(\mathbf q)\ddot{\mathbf q}
=
\mathbf{Q}^\ast(\mathbf q,\dot{\mathbf q},t)
$$

其中 $\mathbf M$ 为系统质量矩阵，$\mathbf Q^\ast$ 包括外部广义力以及由速度等产生的动力学项。

## 增广建模与嵌入建模

对于存在约束

$$
\mathbf C(\mathbf q,t)=0
$$

的系统，有两种基本的动力学建模方法。

### 嵌入建模(embedding formulation)

将广义坐标分为独立坐标和非独立坐标：

$$
\mathbf q
=
\begin{bmatrix}
\mathbf q_i\\
\mathbf q_d
\end{bmatrix}
$$

由

$$
\mathbf C_{\mathbf q_i}\delta\mathbf q_i
+
\mathbf C_{\mathbf q_d}\delta\mathbf q_d
=0
$$

如果 $\mathbf C_{\mathbf q_d}$ 可逆，则有

$$
\delta\mathbf q_d
=
-
\mathbf C_{\mathbf q_d}^{-1}
\mathbf C_{\mathbf q_i}
\delta\mathbf q_i
$$

因此所有允许虚位移都可以仅由独立坐标的虚位移表示。

通过这种方式，可以将非独立坐标从动力学方程中消去，最终得到仅关于独立坐标的微分方程。

嵌入建模的优点是最终动力学方程维数较小，只包含真正的系统自由度；

缺点是需要持续确定哪些坐标是独立坐标、哪些是非独立坐标，并且在复杂闭环系统中坐标分割可能比较困难。

### 增广建模(augmented formulation)

另一种方法是不消去非独立广义坐标，而是保留完整的冗余坐标 $\mathbf q$，同时引入拉格朗日乘子 $\boldsymbol\lambda$ 表示约束反力。

:::info
拉格朗日乘子 $\boldsymbol\lambda$ 本身的数值依赖于约束方程的定义和尺度。

例如将约束

$$
C(\mathbf q)=0
$$

改写为

$$
2C(\mathbf q)=0
$$

虽然物理约束完全相同，但对应的 $\lambda$ 会发生变化。

真正具有直接物理意义的是广义约束力

$$
\mathbf Q_\lambda
=
\mathbf C_{\mathbf q}^\top\boldsymbol\lambda
$$
:::

此时动力学可以写成

$$
\mathbf M(\mathbf q)\ddot{\mathbf q}
-
\mathbf Q
+
\mathbf C_{\mathbf q}^\top\boldsymbol\lambda
=
0
$$

即

$$
\mathbf M(\mathbf q)\ddot{\mathbf q}
+
\mathbf C_{\mathbf q}^\top\boldsymbol\lambda
=
\mathbf Q
$$

这种方法不需要显式消去约束坐标，因此特别适合通用多体系统建模。

代价是系统中除了微分变量 $\mathbf q$ 外，还出现了代数变量 $\boldsymbol\lambda$，因此最终得到的是微分-代数方程(DAE)。

## 刚体系统的约束动力学方程（KKT方程）

### 刚体的位姿与速度表示

对于空间中的一个刚体，可以使用参考点的位置

$$
\mathbf r\in\mathbb R^3
$$

描述平移运动。

姿态可以使用 Euler parameters，即单位四元数

$$
\boldsymbol\theta
=
[\theta_0,\theta_1,\theta_2,\theta_3]^\top
$$

表示，并满足归一化约束

$$
\boldsymbol\theta^\top\boldsymbol\theta=1
$$

因此如果使用位置与 Euler parameters 作为冗余广义坐标，则一个空间刚体可以写成

$$
\mathbf q^b
=
\begin{bmatrix}
\mathbf r\\
\boldsymbol\theta
\end{bmatrix}
$$

共有 7 个广义坐标，但由于四元数归一化约束只有 6 个实际自由度。

刚体的角速度 $\boldsymbol\omega$ 与 Euler parameters 的导数之间存在关系

$$
\boldsymbol\omega
=
\mathbf G(\boldsymbol\theta)
\dot{\boldsymbol\theta}
$$

其中 $\mathbf G$ 是由当前姿态决定的矩阵。

因此，刚体的平动速度由 $\dot{\mathbf r}$ 描述，转动速度则由 $\boldsymbol\omega$ 描述。

:::note
用于表示刚体姿态的参数有多种选择，例如欧拉角、方向余弦、四元数等。
对于不同的姿态参数，都可以构造相应的矩阵 $\mathbf G$，使角速度写成
$$
\boldsymbol\omega=\mathbf G(\boldsymbol\theta)\dot{\boldsymbol\theta}
$$
但不同姿态参数对应的 $\mathbf G$ 的形式和维数可能不同。

对于下面给出的 Euler parameters （四元数）情况，该矩阵对应刚体系下的角速度表示。
$$
\mathbf{G}(\mathbf \theta)=2\left[\begin{matrix}
-\theta_1 & \theta_0 & \theta_3 & -\theta_2 \\
-\theta_2 & -\theta_3 & \theta_0 & \theta_1 \\
-\theta_3 & \theta_2 & -\theta_1 & \theta_0
\end{matrix}\right]
$$
:::

### 刚体的质量矩阵

对于第 $i$ 个刚体，其动能可以写成

$$
T^i
=
\frac{1}{2}
\dot{\mathbf q}^{iT}
\mathbf M^i
\dot{\mathbf q}^i
$$

其中 $\mathbf M^i$ 为该刚体的质量矩阵。

如果广义坐标由参考点位置和姿态参数组成，则质量矩阵一般可以写成

$$
\mathbf M^i
=
\begin{bmatrix}
\mathbf M_{rr}^i & \mathbf M_{r\theta}^i\\
\mathbf M_{\theta r}^i & \mathbf M_{\theta\theta}^i
\end{bmatrix}
$$

其中平动部分为

$$
\mathbf M_{rr}^i
=
m_i\mathbf I_3
$$

耦合项
$$
\mathbf M_{r\theta}^i = -\mathbf A^i \left[\int_V^i \rho^i [\mathbf u^i]_\times dV^i \right]\mathbf G^i
$$
其中$\mathbf A^i$是刚体坐标系到世界系的$3\times 3$旋转变换矩阵，$\mathbf u$是刚体系下质点的位矢。

转动部分为
$$
\mathbf M_{\theta\theta}^i = \mathbf G^{i\top} \int_V^i \rho^i [\mathbf u^{i}]_\times^\top [\mathbf u^{i}]_\times dV^i \mathbf G^{i} = \mathbf G^{i\top}\mathbf I^i_{\theta\theta}\mathbf G^{i}
$$
其中$\mathbf I^i_{\theta\theta}=\int_V^i \rho^i [\mathbf u^{i}]_\times^\top [\mathbf u^{i}]_\times dV^i$为**惯性张量**，其对角元素称为惯性矩，非对角元素称为惯性积。

如果参考点选在刚体质心，则一阶质量矩为零，因此平动和转动之间的耦合项消失：

$$
\mathbf M_{R\theta}^i
=
\mathbf M_{\theta R}^i
=
\mathbf 0
$$

于是单个刚体的质量矩阵得到明显简化。

对于由 $n_b$ 个刚体构成的系统，将各刚体的质量矩阵装配为

$$
\mathbf M
=
\operatorname{diag}
\left(
\mathbf M^1,
\mathbf M^2,
\dots,
\mathbf M^{n_b}
\right)
$$

### KKT方程

对于完整约束

$$
\mathbf C(\mathbf q,t)=\mathbf 0
$$

对时间求一次导数：

$$
\mathbf C_{\mathbf q}\dot{\mathbf q}
+
\mathbf C_t
=
\mathbf 0
$$

再次求导得到加速度约束：

$$
\mathbf C_{\mathbf q}\ddot{\mathbf q}
=
\mathbf Q_c
$$

其中 $\mathbf Q_c$ 是约束方程二次求导后所有不含 $\ddot{\mathbf q}$ 的项移到右侧得到的量。

例如对于稳恒约束 $\mathbf C(\mathbf q)=0$，

$$
\mathbf Q_c
=
-
\dot{\mathbf C}_{\mathbf q}\dot{\mathbf q}
$$

系统动力学写成

$$
\mathbf M\ddot{\mathbf q}
+
\mathbf C_{\mathbf q}^\top\boldsymbol\lambda
=
\mathbf Q_e+\mathbf Q_v
$$

其中：

- $\mathbf Q_e$：外部广义力，例如重力、驱动力、弹簧力等；
- $\mathbf Q_v$：由速度产生的二次速度惯性项，例如科氏项、离心项和陀螺项；
- $\mathbf Q_c$：加速度级约束方程的右端项，并不是广义力。

:::note
对于质心作为参考点、四元数表示姿态时，单个刚体的
$$
\mathbf Q_v=\left[\begin{matrix}\mathbf 0^\top & -2\boldsymbol \omega^{i\top}\mathbf I_{\theta\theta}^i \dot{\mathbf G}^i \end{matrix}\right]^\top
$$
整个系统的$Q_v$通过将各个刚体纵向拼接得到。

对于一般情况，则需要从拉格朗日方程出发计算。例如机器人学中常见的
$$
\mathbf M(\mathbf q)\ddot{\mathbf q} + \mathbf C(\mathbf q, \dot{\mathbf q})\dot{\mathbf q} = \boldsymbol \tau
$$
形式的拉格朗日方程，
$$
\mathbf Q_v= - \mathbf C(\mathbf q, \dot{\mathbf q})\dot{\mathbf q}
$$
:::

将动力学方程和加速度约束联立，得到

$$
\begin{bmatrix}
\mathbf M & \mathbf C_{\mathbf q}^\top\\
\mathbf C_{\mathbf q} & \mathbf 0
\end{bmatrix}
\begin{bmatrix}
\ddot{\mathbf q}\\
\boldsymbol\lambda
\end{bmatrix}
=
\begin{bmatrix}
\mathbf Q_e+\mathbf Q_v\\
\mathbf Q_c
\end{bmatrix}
$$

求解该方程可以同时得到系统加速度 $\ddot{\mathbf q}$ 和约束反力对应的拉格朗日乘子 $\boldsymbol\lambda$。

:::note
KKT方程的推导——从拉格朗日第二类方程出发

1. 先由系统运动学写出$T(q,\dot{q})$
2. 计算质量矩阵$M={\partial^2 T} / {\partial \dot{q}^2}$
3. 计算$Qv = -\dot{M}\dot{q} + (\partial T/\partial q)^\top$

实际计算一般不采用。有两类做法：冗余坐标（此时质量矩阵直接对角拼装、广义力纵向堆叠，多刚体间的耦合靠约束来实现）、牛顿-欧拉迭代。
:::

:::info
KKT方程中的

$$
\mathbf C_{\mathbf q}\ddot{\mathbf q}=\mathbf Q_c
$$

只在加速度层满足约束。理论上，如果初始时

$$
\mathbf C=0,\qquad
\dot{\mathbf C}=0
$$

则约束会一直成立；但数值积分会产生误差，使 $\mathbf C$ 和 $\dot{\mathbf C}$ 逐渐偏离零，这称为 **constraint drift**。

实际计算中常使用位置/速度投影、Newton-Raphson校正或Baumgarte stabilization等方法抑制约束漂移。
例如在NMPC中，可以将原始约束作为优化约束加进去，以移植漂移。
:::

### 牛顿-欧拉方程

如果将刚体参考点选在质心，则平动和转动惯性解耦。

$$
\begin{bmatrix}
m_i\mathbf I_3 & \mathbf 0\\
\mathbf 0 & \mathbf I^i
\end{bmatrix}
\begin{bmatrix}
\ddot{\mathbf R}^i\\
\boldsymbol\alpha^i
\end{bmatrix}
=
\begin{bmatrix}
\mathbf F^i\\
\boldsymbol\tau^i
-
\boldsymbol\omega^i
\times
(\mathbf I^i\boldsymbol\omega^i)
\end{bmatrix}
$$

其中上半部分为 Newton 方程：

$$
m_i\ddot{\mathbf R}^i
=
\mathbf F^i
$$

描述质心的平动。

下半部分为 Euler 方程：

$$
\mathbf I^i\boldsymbol\alpha^i
+
\boldsymbol\omega^i
\times
(\mathbf I^i\boldsymbol\omega^i)
=
\boldsymbol\tau^i
$$

描述刚体的转动。其中$\boldsymbol \alpha$为角加速度。

## 非完整约束

对于非完整约束，约束关系不能积分为只含 $\mathbf q$ 和 $t$ 的形式。

常见的形式(Pfaffian约束)为

$$
\mathbf a_0(\mathbf q,t)
+
\mathbf B(\mathbf q,t)\dot{\mathbf q}
=
\mathbf 0
$$

其中 $\mathbf B$ 为速度约束矩阵。

允许的虚位移满足

$$
\mathbf B\delta\mathbf q
=
\mathbf 0
$$

因此理想约束产生的广义约束力可以写成

$$
\mathbf Q_c^{force}
=
\mathbf B^T\boldsymbol\lambda
$$

对速度约束求时间导数，可以得到加速度级约束：

$$
\mathbf B\ddot{\mathbf q}
=
\mathbf Q_{c,nh}
$$

其中

$$
\mathbf Q_{c,nh}
=
-
\dot{\mathbf B}\dot{\mathbf q}
-
\dot{\mathbf a}_0
$$

因此非完整约束下的动力学同样可以写成类似的 KKT 形式：

$$
\begin{bmatrix}
\mathbf M & \mathbf B^T\\
\mathbf B & \mathbf 0
\end{bmatrix}
\begin{bmatrix}
\ddot{\mathbf q}\\
\boldsymbol\lambda
\end{bmatrix}
=
\begin{bmatrix}
\mathbf Q_e+\mathbf Q_v\\
\mathbf Q_{c,nh}
\end{bmatrix}
$$

与完整约束相比，两者的 KKT 结构相同，但完整约束中的约束矩阵来自

$$
\mathbf C_{\mathbf q}
=
\frac{\partial \mathbf C}{\partial \mathbf q}
$$

如果进一步考虑一般形式的速度约束

$$
\boldsymbol\Phi(\mathbf q,\dot{\mathbf q},t)
=
\mathbf 0
$$

可以采用 **Chetaev 条件**规定允许虚位移：

$$
\frac{\partial\boldsymbol\Phi}{\partial\dot{\mathbf q}}
\delta\mathbf q
=
\mathbf 0
$$

记

$$
\mathbf A
=
\frac{\partial\boldsymbol\Phi}{\partial\dot{\mathbf q}}
$$

则理想约束产生的广义约束力为

$$
\mathbf Q_c^{force}
=
\mathbf A^T\boldsymbol\lambda
$$

对原速度约束求时间导数：

$$
\mathbf A\ddot{\mathbf q}
+
\boldsymbol\Phi_{\mathbf q}\dot{\mathbf q}
+
\boldsymbol\Phi_t
=
\mathbf 0
$$

因此可以写成 KKT 形式：

$$
\begin{bmatrix}
\mathbf M & \mathbf A^T\\
\mathbf A & \mathbf 0
\end{bmatrix}
\begin{bmatrix}
\ddot{\mathbf q}\\
\boldsymbol\lambda
\end{bmatrix}
=
\begin{bmatrix}
\mathbf Q_e+\mathbf Q_v\\
-\boldsymbol\Phi_{\mathbf q}\dot{\mathbf q}-\boldsymbol\Phi_t
\end{bmatrix}
$$

:::info
对于线性速度约束

$$
\mathbf B(\mathbf q,t)\dot{\mathbf q}+\mathbf a_0=0
$$

Chetaev条件是经典非完整力学中常用且自然的选择。

但对于一般非线性速度约束

$$
\boldsymbol\Phi(\mathbf q,\dot{\mathbf q},t)=0
$$

采用

$$
\boldsymbol\Phi_{\dot{\mathbf q}}\delta\mathbf q=0
$$

属于一种建模原则，并不是由约束方程本身唯一推出的结果。其他变分处理，例如vakonomic mechanics，可能产生不同的动力学方程。
:::
