# Mission: 吃透 Agent 平台设计（以 NAP 为解剖标本）

## Why
学员是 butterfly（教育 agent 引擎）的作者，已从引擎内部深度理解 agent（turn 循环、工具系统、闸门）。现在要补上**平台视角**：一个系统如何托管、隔离、分发、伸缩多个 agent。学成后能独立评估任何 agent 平台，并回答"butterfly 若要平台化，该抄什么、该避开什么"。

## Success looks like
- 不看资料，白板画出 NAP 全链路（入口 → 调度 → pod → 工具 → 文件交付），并标注每个组件的生死边界
- 对每个关键设计决策（控制反转、RWX 共享卷、MCP 中转、headless Service、scale-to-zero）能说出它的 trade-off 和适用前提
- 拿一份陌生 agent 平台的架构图，能指出它的单点、隔离边界和扩展缝
- 能写出一页"butterfly 平台化路线图"：哪些件直接搬 NAP 的形状，哪些因模型不同不适用

## Constraints
- 自底向上（2026-10-23 校正，取代“先地图后钻探”）：从 pod/容器级基础件起步，每课只讲一个概念、≤15 分钟、立即用 NAP 真实文件落地；基础件学完后才汇合到全景图
- K8s 与 MCP 从零教起：k3s 仅“部署工具”级理解；术语首次出现必须先定义
- 中文交流

## Out of scope
- 给 NAP 贡献代码所需的开发环境搭建
- K8s 认证级深度（CRI/CSI 源码、调度器内部）
- web/ 前端实现细节（React 组件层面）
- NAP 运维部署操作手册（self-host 脚本细节）
