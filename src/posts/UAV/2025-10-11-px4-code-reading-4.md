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
控制分配器有两个版本，通过参数`CA_METHOD`控制。

## 伪逆法控制分配器

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