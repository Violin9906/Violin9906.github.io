---
icon: pen-to-square
date: 2025-09-26
tag:
  - UAV
  - PX4
category:
  - UAV
---

# PX4飞控代码阅读（2）位置速度控制器

## 多旋翼控制器结构

整体控制器结构如下

![控制器结构](https://docs.px4.io/main/assets/mc_control_arch.DPb5OeqV.jpg)

各模块分别位于：
- Position Control, Velocity Control, Acceleration&Yaw to Attitude: `src\modules\mc_pos_control`
- Angle Control: `src\modules\mc_att_control`
- Angular Rate Control: `src\modules\mc_rate_control`
- Mixer: `src\modules\control_allocator`