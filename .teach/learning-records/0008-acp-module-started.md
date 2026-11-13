# ACP 模块开课：实现撞墙 → 完整学协议

2026-11-13 学员在实现 agent-hub 的 acp-adapter 时撞墙（"不了解 ACP 写不下去"：SDK 0.14→2.x 的 API 迁移 + 协议本身不熟双重缺口），决定暂停编码、完整学一遍 ACP（Zed 的 Agent Client Protocol）。

**决策**：课程对齐 **ACP v1**（学员 SDK 2.5 稳定入口的 wire 协议、Zed 现行版本）；v2 文档（学员提供的 protocol/v2/overview）仅作草案雷达。依据：SDK 自带 MIGRATION 文档明示 v2 = experimental draft。

**Implications**: 新课 0009–0014（全景→握手→事件词表→权限与中断→传输→毕业设计）。毕业设计直接对接 agent-hub 的 M3（ws 端点 + echo bridge），课程毕业即工程落地。学员已有基础：JSON-RPC 信封（刚学）、MCP 三动作（L07）、翻译层/中间表示概念（adapter 讨论）、SDK 2.x API 对照表（acp-bridge 讨论中给过）。
