---
icon: pen-to-square
date: 2025-09-26
tag:
  - UAV
  - PX4
category:
  - UAV
---

# PX4飞控代码阅读（1）基本架构

![软件架构](https://docs.px4.io/main/assets/PX4_Architecture.sDy5Z0TR.svg)

<!-- more -->

## 代码结构（基于v1.16.0）

```
PX4-Autopilot/
├── src/                           # 核心源代码
│   ├── modules/                   # 核心功能模块
│   │   ├── commander/            # 系统状态管理和模式切换
│   │   ├── navigator/            # 任务规划和导航
│   │   ├── attitude_estimator_q/ # 姿态估计(Q方法)
│   │   ├── position_estimator_inav/ # 位置估计
│   │   ├── mc_att_control/       # 多旋翼姿态控制
│   │   ├── mc_pos_control/       # 多旋翼位置控制
│   │   ├── fw_att_control/       # 固定翼姿态控制
│   │   ├── fw_pos_control/       # 固定翼位置控制
│   │   ├── land_detector/        # 着陆检测
│   │   ├── sensors/              # 传感器数据处理
│   │   └── ... 其他功能模块
│   ├── drivers/                  # 硬件驱动层
│   ├── lib/                     # 核心库文件
│   │   ├── cdev/                # 字符设备框架
│   │   ├── circuits/            # 电路相关库
│   │   ├── controllib/          # 控制算法库
│   │   ├── mixer/               # 混控器库
│   │   ├── uORB/                # 微对象请求代理(通信中间件)
│   │   ├── mathlib/             # 数学库
│   │   ├── matrix/              # 矩阵运算库
│   │   └── ... 其他支持库
│   └── systemcmds/              # 系统命令
│       ├── top/                 # 系统状态查看
│       ├── perf/                # 性能测试
│       ├── reboot/              # 重启命令
│       └── ... 其他系统命令
├── platforms/                   # 平台支持
│   ├── nuttx/                  # NuttX RTOS相关代码
│   │   ├── src/                # 平台特定源码
│   │   ├── nuttx-configs/      # NuttX配置
│   │   └── include/            # 头文件
│   └── common/                 # 通用平台支持
│       ├── include/            # 通用头文件
│       └── work_queue/         # 工作队列
├── msg/                        # uORB消息定义文件
│   ├── actuator_controls.msg   # 执行器控制消息
│   ├── sensor_combined.msg     # 传感器融合消息
│   ├── vehicle_attitude.msg    # 飞行器姿态消息
│   └── ... 其他消息定义
├── ROMFS/                      # 根文件系统
│   ├── px4fmu_common/          # FMU通用配置
│   │   └── init.d/             # 启动脚本
│   │       ├── rcS             # 主启动脚本
│   │       ├── 4001_mpu6000    # MPU6000驱动启动
│   │       └── ... 其他启动配置
│   └── px4fmu_test/            # 测试配置
├── boards/                     # 板级支持包(BSP)
│   ├── px4/                    # Pixhawk系列板卡
│   │   ├── fmu-v5/             # FMUv5配置
│   │   │   ├── board_config.h  # 板级配置
│   │   │   ├── nuttx-config/   # NuttX配置
│   │   │   └── src/            # 板级源码
│   │   ├── fmu-v4/             # FMUv4配置
│   │   ├── fmu-v3/             # FMUv3配置
│   │   └── ... 其他板卡配置
│   └── ... 其他硬件平台
├── Tools/                      # 开发工具
│   ├── jmavsim/               # Java模拟器
│   ├── sitl_gazebo/           # Gazebo模拟器
│   ├── check_code_style.sh    # 代码风格检查
│   └── ... 其他工具脚本
├── test/                       # 测试框架
│   ├── unit/                  # 单元测试
│   ├── system/                # 系统测试
│   └── ... 其他测试
├── cmake/                     # CMake构建配置
├── Documentation/             # 文档
├── Launch/                    # 启动配置
└── ... 其他配置和资源文件
```

## 系统启动流程（Nuttx）

### Bootloader

程序的入口位于`platforms\nuttx\NuttX\nuttx\arch\arm\src\stm32h7\stm32_start.c`中的`void __start(void)`函数。其注释也说明了这里是reset entry point。

在初始化基本的时钟和内存等后，调用`stm32_boardinitialize()`，它定位到PX4代码中的`boards\holybro\kakuteh7-wing\src\bootloader_main.c`中，在此处进行板级的硬件初始化，可以看到只有一个初始化USB的代码：
```c
__EXPORT void stm32_boardinitialize(void)
{
	/* configure USB interfaces */
	stm32_usbinitialize();
}
```

最后调用`nx_start()`启动操作系统。在该函数中进行操作系统的初始化操作后，调用`nx_bringup()`来启动操作系统的入口，位于`platforms\nuttx\NuttX\nuttx\sched\init\nx_bringup.c`中。这里可以看到启动了`CONFIG_INIT_ENTRYNAME`的task：
```c
ret = nxtask_create(CONFIG_INIT_ENTRYNAME, CONFIG_INIT_PRIORITY,
                    CONFIG_INIT_STACKSIZE,
                    (main_t)CONFIG_INIT_ENTRYPOINT, argv);
```
它在`boards\holybro\kakuteh7-wing\nuttx-config\bootloader\defconfig`中被配置为`bootloader_main`，位于`platforms\nuttx\src\bootloader\stm\stm32_common\main.c`中。注意此bootloader非彼bootloader，这个代码是负责固件升级之类的一小段程序，并非系统启动引导程序。可以看到仓库中只有H7系列的bootloader，其它系列的则位于一个独立的仓库[PX4-Bootloader](https://github.com/PX4/PX4-Bootloader)中。

而正常情况下进入系统，应该是使用`boards\holybro\kakuteh7-wing\nuttx-config\nsh\defconfig`中的配置，即`CONFIG_INIT_ENTRYPOINT="nsh_main"`。至于这两种配置是怎样切换的，我对nuttx并不熟悉，不过可以猜想到通过某种触发固件更新的机制才会进入到上面的bootloader中，一般情况下则是进入Nuttx shell，即nsh_main（位置在`platforms\nuttx\NuttX\apps\system\nsh\nsh_main.c`）。

到此，系统的引导和启动就完成了

### 飞控系统

系统启动后将加载`ROMFS\px4fmu_common\init.d\rcS`，并根据机体类型加载`ROMFS\px4fmu_common\init.d`下对应的脚本，如多旋翼的`rc.mc_defaults`和`rc.mc_apps`，后者决定了启动哪些模块：
```sh
#!/bin/sh
#
# Standard apps for multirotors. Attitude/Position estimator, Attitude/Position control.
#
# NOTE: Script variables are declared/initialized/unset in the rcS script.
#

#
# Start Control Allocator
#
control_allocator start

#
# Start Multicopter Rate Controller.
#
mc_rate_control start

#
# Start Multicopter Attitude Controller.
#
mc_att_control start

if param greater -s MC_AT_EN 0
then
	mc_autotune_attitude_control start
fi

#
# Start Multicopter Position Controller.
#
mc_hover_thrust_estimator start
flight_mode_manager start
mc_pos_control start

#
# Start Multicopter Land Detector.
#
land_detector start multicopter
```

此外，`airframes`目录下还有各类机架的配置信息，用于混控器。

## 任务和工作队列

PX4的模块有两种运行方式：作为任务（Task）运行和作为工作队列任务（Work Queue Task）运行。

| 特性             | 任务 (Tasks)                                           | 工作队列任务 (Work Queue Tasks)                              |
| :--------------- | :----------------------------------------------------- | :----------------------------------------------------------- |
| **运行方式**     | 在**独立任务**中运行，拥有自己的堆栈和进程优先级       | 在**共享任务**（工作队列）上运行，多个模块共享同一堆栈和线程优先级 |
| **资源开销**     | 较高（每个任务都需要分配堆栈）                         | **较低**（共享堆栈，减少内存占用和任务切换开销）             |
| **适用场景**     | 长时间运行、需要阻塞等待（如poll）、高实时性要求的模块 | **周期性任务**、传感器驱动、大多数控制器                     |
| **实现复杂度**   | 相对较高，需自行管理任务循环                           | 相对较低，框架提供周期性调度                                 |
| **代码模板位置** | `src/templates/template_module/`                       | `src/examples/work_item/`                                    |

PX4自带了一些工作队列，在`platforms\common\include\px4_platform_common\px4_work_queue\WorkQueueManager.hpp`中可以查看：
```cpp
struct wq_config_t {
	const char *name;
	uint16_t stacksize;
	int8_t relative_priority; // relative to max
};

namespace wq_configurations
{
static constexpr wq_config_t rate_ctrl{"wq:rate_ctrl", 3150, 0}; // PX4 inner loop highest priority

static constexpr wq_config_t SPI0{"wq:SPI0", 2392, -1};
static constexpr wq_config_t SPI1{"wq:SPI1", 2392, -2};
static constexpr wq_config_t SPI2{"wq:SPI2", 2392, -3};
static constexpr wq_config_t SPI3{"wq:SPI3", 2392, -4};
static constexpr wq_config_t SPI4{"wq:SPI4", 2392, -5};
static constexpr wq_config_t SPI5{"wq:SPI5", 2392, -6};
static constexpr wq_config_t SPI6{"wq:SPI6", 2392, -7};

static constexpr wq_config_t I2C0{"wq:I2C0", 2336, -8};
static constexpr wq_config_t I2C1{"wq:I2C1", 2336, -9};
static constexpr wq_config_t I2C2{"wq:I2C2", 2336, -10};
static constexpr wq_config_t I2C3{"wq:I2C3", 2336, -11};
static constexpr wq_config_t I2C4{"wq:I2C4", 2336, -12};

// PX4 att/pos controllers, highest priority after sensors.
static constexpr wq_config_t nav_and_controllers{"wq:nav_and_controllers", 2240, -13};

static constexpr wq_config_t INS0{"wq:INS0", 6000, -14};
static constexpr wq_config_t INS1{"wq:INS1", 6000, -15};
static constexpr wq_config_t INS2{"wq:INS2", 6000, -16};
static constexpr wq_config_t INS3{"wq:INS3", 6000, -17};

static constexpr wq_config_t hp_default{"wq:hp_default", 2800, -18};

static constexpr wq_config_t uavcan{"wq:uavcan", 3624, -19};

static constexpr wq_config_t ttyS0{"wq:ttyS0", 1728, -21};
static constexpr wq_config_t ttyS1{"wq:ttyS1", 1728, -22};
static constexpr wq_config_t ttyS2{"wq:ttyS2", 1728, -23};
static constexpr wq_config_t ttyS3{"wq:ttyS3", 1728, -24};
static constexpr wq_config_t ttyS4{"wq:ttyS4", 1728, -25};
static constexpr wq_config_t ttyS5{"wq:ttyS5", 1728, -26};
static constexpr wq_config_t ttyS6{"wq:ttyS6", 1728, -27};
static constexpr wq_config_t ttyS7{"wq:ttyS7", 1728, -28};
static constexpr wq_config_t ttyS8{"wq:ttyS8", 1728, -29};
static constexpr wq_config_t ttyS9{"wq:ttyS9", 1728, -30};
static constexpr wq_config_t ttyACM0{"wq:ttyACM0", 1728, -31};
static constexpr wq_config_t ttyUnknown{"wq:ttyUnknown", 1728, -32};

static constexpr wq_config_t lp_default{"wq:lp_default", 3500, -50};

static constexpr wq_config_t test1{"wq:test1", 2000, 0};
static constexpr wq_config_t test2{"wq:test2", 2000, 0};

} // namespace wq_configurations
```

:::info
这里是我的理解，不一定正确。PX4的工作队列其实并不是一个真正的队列，而是一组工作队列任务的上下文环境，其中每个工作队列任务都可以有自己的运行周期。WorkQueueManager定期检查队列中注册的任务，并将需要运行的任务组成真正的工作队列并执行。

工作队列的调度有多种方式，如`src\examples\work_item\WorkItemExample.cpp`中介绍的：

```cpp
bool WorkItemExample::init()
{
	// execute Run() on every sensor_accel publication
	if (!_sensor_accel_sub.registerCallback()) {
		PX4_ERR("callback registration failed");
		return false;
	}

	// alternatively, Run on fixed interval
	// ScheduleOnInterval(5000_us); // 2000 us interval, 200 Hz rate

	return true;
}
```

似乎大部分都是第一种方式，通过uORB消息回调来触发WorkItem::Run()。这类任务有一个甚至多个`uORB::SubscriptionCallbackWorkItem`成员，它有一个`call()`函数：

```cpp{7}
void call() override
{
    // schedule immediately if updated (queue depth or subscription interval)
    if ((_required_updates == 0)
        || (Manager::updates_available(_subscription.get_node(), _subscription.get_last_generation()) >= _required_updates)) {
        if (updated()) {
            _work_item->ScheduleNow();
        }
    }
}
```

当新消息到达后会立即调度这一任务。

PX4中位置控制、姿态控制、角速度控制都是这种消息触发的方式，可能是出于性能考虑，但是也导致分析控制周期很麻烦。
:::

## uORB中间件

类似ROS的消息发布/订阅框架。关于定义新消息，参见[官方文档](https://docs.px4.io/main/en/middleware/uorb)。

官方文档中给的C-like API实际上已经没在用了，代码中基本上都是封装好的Class API。

下面列出常用的API：

- `uORB::Publication<T> pub(ID)` 声明一个发布者
	- `bool publish(const T &data)` 发布数据，未advertise的会自动advertise（注册）
- `uORB::PublicationMulti<T> pub(ID)` 用于多个发布者在同一个话题上发布独立数据，每个发布者会在advertise时分配一个instance编号
	- `bool publish(const T &data)` 发布数据
	- `int get_instance()` 查看instance编号
- `uORB::Subscription<T> sub(ID, instance=0)` 声明一个订阅者，可以指定instance编号
	- `bool updated()` 检查是否有更新
	- `bool update(*dst)`/`bool copy(*dst)` 读出数据
- `uORB::SubscriptionInterval<T> sub(ID, interval_us=0, instance=0)` 带最小更新间隔的订阅者（代码注释写的是最大，有误）
	- `bool update(*dst)` 检查是否有更新，如有则调用copy读出数据。*和Subsciption不一样，好tm傻逼的设计*
- `uORB::SubscriptionCallbackWorkItem<T> sub(*work_item, ID, instance=0)` 覆盖了`uORB::SubscriptionCallback`的`call`虚函数，消息更新时自动触发`work_item`的`Run`

:::note
感觉PX4也是屎山，这就是大型项目的命运吗 : (
:::
