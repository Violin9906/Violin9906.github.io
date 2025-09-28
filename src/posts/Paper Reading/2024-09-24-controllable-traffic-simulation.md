---
icon: pen-to-square
date: 2024-09-24
tag:
  - Scenario Generation
  - LLM
category:
  - Paper Reading
---

# Controllable Traffic Simulation through LLM-Guided Hierarchical Chain-of-Thought Reasoning

> Zhiyuan Liu, Leheng Li, Yuning Wang, Haotian Lin, Zhizhe Liu, Lei He, Jianqiang Wang
> 通讯作者：王建强，清华大学车辆与运载学院院长
> [arXiv: 2409.15135](https://arxiv.org/abs/2409.15135)

![系统架构图](https://i.imgur.com/ydDZAHo.png)

## 简介

作者针对现有交通场景生成方法在场景可控性方面的不足，提出了一种基于diffusion的LLM增强的交通模拟框架。具体而言，该框架结合了思维链（CoT）机制，以增强LLM对复杂场景的理解。此外，还提出了一个基于Frenet坐标系的Cost function框架，其值具有几何意义，以提高LLM对空间关系的把握。在 Waymo Open Motion Dataset（WOMD）上的实验表明，该方法可以处理更复杂的描述，以可控的方式生成更广泛的场景，并且在效率方面优于现有的基于diffusion的方法。






