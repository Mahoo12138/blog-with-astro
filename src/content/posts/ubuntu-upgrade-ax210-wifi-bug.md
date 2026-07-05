---
title: 记录一次 Ubuntu 依赖升级引发的 AX210 网卡故障
date: 2026-07-05 20:38:54
categories: 
- 经验教程
tags:
- AX210
---



## 背景

难得闲暇的一个周末，在家里维护整理手上的机器，只是在香橙派 Ubuntu 上简单执行了 `apt upgrade`，一次常规的依赖升级，重启后，发现部署在该机器上的服务都访问不了，排查后发现是该机器断网了，准确说是 AX210 罢工了。

> AX210 是英特尔于 2020 年推出的 **首款支持 Wi‑Fi 6E 标准**的无线网卡，依赖名为`iwlwifi` 的驱动，驱动主线支持始于 5.10 内核，也就是说，这个驱动支持的最低 Linux 内核版本是 5.10。

我依稀记得之前已经遇到过这样的情况了，此次特意记录一下相关概念以及整个解决过程。

## 故障现象

升级后重启，系统表现如下：

- 无线网络设置中找不到任何 Wi-Fi 适配器
- `nmcli device` 命令输出中看不到 wlan 接口
- `lspci` 仍能识别到 AX210 硬件：`Network controller: Intel Corporation Wi-Fi 6 AX210/AX211/AX411 160MHz (rev 1a)`
- `dmesg | grep iwl` 显示固件加载失败或 PNVM 超时错误：`Timeout waiting for PNVM load! `

简单来说：**硬件能看见，驱动加载不了**。

## 原因分析

Intel AX210 在 Linux 下的正常运作依赖于一套完整的“驱动栈”：

1. **内核版本**：5.10+ 提供基础的 `iwlwifi` 驱动支持
2. **网卡固件**（`/lib/firmware/iwlwifi-*.ucode`）：网卡运行所需的**微码**
3. **PNVM 文件**（`iwlwifi-ty-a0-gf-a0.pnvm`）：存放设备配置参数的非易失性内存映像

这块我觉得可以多说一点，`*.ucode` 微码指的并不是 CPU 的微码（CPU Microcode），而是**设备固件（Device Firmware）**，算是个历史遗留的叫法。

它是一段由 Intel 官方编译好的**二进制程序**，它**不是驱动（驱动是 `.ko` 文件）**，而是网卡自身那块小 CPU（嵌入式控制器）需要运行的“操作系统”或“指令集”。

当操作系统启动时，内核驱动（`iwlwifi`）会把这个文件**直接上传到网卡的硬件缓存**中，让网卡的内置处理器跑起来，负责无线电调谐、加密解密、MAC 层管理等核心功能。

**简单说：**微码文件就是网卡驱动的固件，为什么叫“微码”而不是“固件”？这是 Linux 内核社区的历史惯例。Intel 的无线网卡驱动很早就把这个上传到硬件的二进制包命名为 **`ucode`**（Microcode 的缩写，`micro-` 对应的国际标准符号是希腊字母 **μ**），与常说的 CPU 漏洞修复补丁（Intel CPU Microcode）是两码事。

**PNVM** 的全称是 **Platform Non-Volatile Memory**（平台非易失性内存），但在 Intel 无线网卡的 Linux 驱动语境下，它并不是硬件上的存储芯片，而是一个**随固件一起加载的配置数据包**。

也就是说，PNVM 文件**不是可执行程序**，而是一份**硬件参数配置表**。在 AX210 网卡内部有一个很小的只读存储区，存着出厂默认参数。Intel 允许 Linux 驱动在加载时，**从硬盘上读取这个 `.pnvm` 文件动态覆盖**内部默认值。

例如 PNVM 的核心作用之一是存储 **6GHz 频段的法规限制**。由于各国对 6GHz 的开放进度不同，Intel 通过外部 PNVM 文件动态调整网卡行为。

这次升级导致网卡罢工，本质上是**内核与固件版本不匹配**造成的。Ubuntu 的 `linux-firmware` 包在升级后可能引入了新版固件配置，而当前 5.10 内核 的`iwlwifi` 驱动代码是“老古董”，它只认识旧格式的 PNVM 配置表。当它尝试解析新文件时，发现“字段对不上”或“校验和不匹配”，于是驱动直接放弃加载。这是一个已知的兼容性问题，在 Debian 11（内核 5.10.x）与 AX210 的组合中也同样存在。

## 解决方案

### 方案一：重命名有问题的 PNVM 文件

这是社区验证过的最快修复方法：

```bash
sudo mv /usr/lib/firmware/iwlwifi-ty-a0-gf-a0.pnvm /usr/lib/firmware/iwlwifi-ty-a0-gf-a0.bak
sudo reboot
```

**原理**：当驱动找不到外部 PNVM 文件时，会**回退（Fallback）**到网卡硬件内部固化的默认配置。虽然可能缺少针对最新硬件的微调，但基础功能完全可用——这足以让网卡恢复正常工作。

### 方案二：更新 linux-firmware 到适配版本

如果方案一无效，可以尝试更新固件包：

```bash
sudo apt update
sudo apt install --reinstall linux-firmware
```

或者从 Intel 官网手动下载最新固件，解压后复制到 `/lib/firmware/`：

```bash
sudo cp iwlwifi-* /lib/firmware/
sudo update-initramfs -u
sudo reboot
```

### 方案三：升级内核

如果以上方法都不奏效，可以考虑升级到更新的内核版本（如 5.15 或 6.x），新内核的 `iwlwifi` 驱动已支持新版 PNVM 格式：

```bash
sudo apt install --install-recommends linux-generic-hwe-22.04
sudo reboot
```

最终，我通过方案一解决了该问题，香橙派 5 Plus 官方 Ubuntu 镜像仅维护两个内核版本：**5.10** 和 **6.1**。不太敢升级到 5.15 或主线 6.x ，可能引入其他硬件兼容性问题。

## 其他操作

### 设置静态 IP

#### 1. 查看当前连接信息

首先，找出你正在使用的Wi-Fi连接的确切名称。

```bash
nmcli connection show
```

在输出中找到你的Wi-Fi连接，记下 `NAME` 一栏的内容。

#### 2. 修改连接为静态IP

使用以下命令修改连接配置。请将命令中的参数替换为你自己的网络信息。

```bash
sudo nmcli connection modify "Wi-Fi SSID" \
ipv4.method manual \
ipv4.addresses 192.168.10.100/24 \
ipv4.gateway 192.168.10.1 \
ipv4.dns "192.168.10.1 8.8.8.8"
```

- `ipv4.method manual`：将连接设置为手动（静态）模式。
- `ipv4.addresses`：设置静态IP地址和子网掩码（如 `192.168.10.100/24`）。
- `ipv4.gateway`：设置默认网关地址。
- `ipv4.dns`：设置DNS服务器，多个地址用空格分隔。

#### 3. 重新激活连接

配置修改后，需要重新激活连接使其生效。

```bash
sudo nmcli connection up "Wi-Fi SSID"
```

## 参考资料

- [Linux系统Intel AX210无线网卡故障排除指南 - 知乎](https://zhuanlan.zhihu.com/p/578531885)
- [networking - Intel Wifi 6 AX210 - WiFi not working after Update - Ask Ubuntu](https://askubuntu.com/questions/1360175/intel-wifi-6-ax210-wifi-not-working-after-update)
- [networking - Ubuntu 20.04 LTS driver Intel Wi-Fi 6E AX210 160MHz - Ask Ubuntu](https://askubuntu.com/questions/1326386/ubuntu-20-04-lts-driver-intel-wi-fi-6e-ax210-160mhz)