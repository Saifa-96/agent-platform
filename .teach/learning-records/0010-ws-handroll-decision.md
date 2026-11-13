# M3 传输层决策回摆：自研 ws（依 NAP），SDK 仅用 types

2026-11-13 学员最终决策。过程：最初建议"手搓（NAP 方式）"→ 修正为"用 SDK 2.x 传输层"→ 验证发现官方对 Hono 集成无文档、upgrade 阶段 Acp-Connection-Id 头协议在第三方 ws 框架内难对齐 → **回摆到手搓，SDK 仅 type-only**。待摸透机制后可再评估切换（届时首选官方 Streamable HTTP 面，AcpServer.handleRequest 是 fetch 风格可直接被 Hono 委托）。

**Status**: active
**Implications**:
- M3 = 移植 NAP acp-server.ts 826 行区的 ws 端点（JSON-RPC over ws 手搓）+ @hono/node-ws（基础设施已就位）
- agent-hub 对 SDK 的依赖保持 type-only（acp-bridge.ts 已是这个形态）
- 架构要求：ws 层留在独立模块（如 src/ws-acp.ts），未来替换 = 换一个模块
- 课程影响：L0013/L0014 改为教手搓 ws（读 NAP 826 行区），SDK transports 降级为"替代方案阅读"；L0010 的内存直连实验仍有效（学协议的快捷方式，不进生产代码）
- 学员工程判断力成长标记：这次决策由学员主动做出（权衡官方文档缺失 vs 参考实现成熟度）
