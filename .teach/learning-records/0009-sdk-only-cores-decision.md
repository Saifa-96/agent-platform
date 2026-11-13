# 范围决策：只支持 SDK 型 core，不做 CLI 子进程型

2026-11-13 学员决策：agent-hub 的 agent core 只支持 SDK 型（pi 为主，dsh 型为潜在方向），不引入 CLI 子进程型（codex/claude-code 式 spawn + stdio 桥接）。

**Implications**:
- agent-hub 的 acp-bridge.ts 收窄为**纯契约层**（AgentBridge + AcpSessionHandler）——NAP 的 AcpBridge 基类（spawn CLI + ClientSideConnection/ClientApp 连子进程）彻底出局，之前给的 0.14→2.x Connection 对照表中"连 CLI"的用法用不上
- SDK 的 client() app 保留一个用途：**测试**——in-process 直连自己的 agent app 验证握手/对话（ACP 模块第 10 课的实验形态）
- M3 传输只做 WebSocket；stdio 只在课内作为生态知识了解
- agents/codex 空目录的去留由学员自行处理
- NAP 作为参考实现时：agents/dsh（SDK 型桥，dsh-adapter 包）是对口参照；agents/codex（CLI 型桥）仅作背景阅读
