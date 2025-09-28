---
icon: pen-to-square
date: 2023-08-11
tag:
  - MORL
category:
  - Paper Reading
---

# A Practical Guide to Multi-objective Reinforcement Learning and Planning

本文是2021年关于MO RL和MO Planning的一篇综述。

## MOMDP

MOMDP是一个六元组$\langle S,A,T,\gamma,\mu,\mathbf{R}\rangle$。其中，$S$是状态空间，$A$是动作空间，$T:S\times A\times S\to [0,1]$是状态转移函数，$\gamma$是折扣因子，$\mu:S\to[0,1]$是初始状态的概率分布，$\mathbf{R}:S\times A\times A\to \mathbb{R}^d$是vector-valued reward function，$d\geq 2$是目标数。

MOMDP下，agent执行策略$\pi \in \Pi:S\times A \to [0,1]$，其Value function定义为
$$
\mathbf{V}^\pi=\mathbb{E}\left[ \sum_{k=0}^{\infty} \gamma^k \mathbf{r}_{k+1}|\pi,\mu \right]
$$
$$
\mathbf{V}^\pi(s)=\mathbb{E}\left[ \sum_{k=0}^{\infty} \gamma^k \mathbf{r}_{t+k+1}|\pi,s_{t}=s \right]
$$
在这种情况下，价值函数是矢量，不像单目标RL那样，最优的定义并不是显而易见的。定义效用函数（utility function / scalarisation function）$u:\mathbb{R}^d\to\mathbb{R}$，将价值函数映射到一个标量：
$$
V_{u}^\pi=u(\mathbf{V}^\pi)
$$
此时，MORL的解集有很多种定义：
- undominated set $U(\Pi)$
  这一解集中的策略，是在某一效用函数下，效用值最大的策略。即$U(\Pi)=\{\pi \in \Pi| \exists u,\forall\pi'\in\Pi:u(\mathbf{V}^\pi)\geq u(\mathbf{V}^{\pi'})\}$
- coverage set $CS(\Pi)$
  覆盖集是$U$的子集，且对于任意效用函数，能够在$CS$中找到其效用值最大的策略（因此称覆盖集）
- Pareto Frontier $PF(\Pi)$
  当采用的效用函数满足：$u(\mathbf{V}^\pi)\gt u(\mathbf{V}^{\pi'}) \Leftarrow (\forall i:\mathbf{V}_{i}^\pi \geq \mathbf{V}_{i}^{\pi'})\land (\exists i:\mathbf{V}_{i}^\pi \gt \mathbf{V}_{i}^{\pi'})$时，得到的undominated set就是帕累托边界，即不存在另一个策略，在所有目标维度上都等于或优于当前策略。称这样的效用函数**单调递增**。并且可以定义Pareto-domainates：$\mathbf{V}^\pi \succ_{P}\mathbf{V}^{\pi'} \Leftrightarrow (\forall i:\mathbf{V}_{i}^\pi \geq \mathbf{V}_{i}^{\pi'})\land (\exists i:\mathbf{V}_{i}^\pi \gt \mathbf{V}_{i}^{\pi'})$
- Pareto Coverage Set $PCS(\Pi)$
  由于$PF$是一种undominated set，因此相应可以定义对应的coverage set，不再赘述
- convex hull $CH(\Pi)$
  当效用函数是线性函数（当然也是单调递增的）时，即$u(\mathbf{V}^\pi)=\mathbf{w}^\top\mathbf{V}^\pi$，此时的undomainated set称为凸包$CH$。
- convex coverage set $CCS(\Pi)$
  $CH$对应的覆盖集（凸覆盖集）。对于确定性策略，CH和CCS之间的区别通常很小。但对于随机策略，CH通常很大（可能无穷），但CCS通常小得多，当状态和动作都是有限离散时，CCS总是有限的。CCS还可以用来构建PCS[^1]。

## 问题分类

- *Single policy* VS *Multiple policies*
- *Linear utility function* VS *monotonically increasing utility function*
- *Deterministic policy* VS *Stochastic policy*
- *Scalarised Expected Return (SER)* VS *Expected Scalarised Return (ESR)*

## 算法分类

## Single Policy

## Multi-policy


## 与其他问题的联系

### POMDP

### Multi-agent problems

### Multi-/auxiliary task RL

### Human-aligned agents

## MORL性能指标


[^1]: Vamplew, Peter, et al. "Constructing stochastic mixture policies for episodic multiobjective reinforcement learning tasks." _AI 2009: Advances in Artificial Intelligence: 22nd Australasian Joint Conference, Melbourne, Australia, December 1-4, 2009. Proceedings 22_. Springer Berlin Heidelberg, 2009.