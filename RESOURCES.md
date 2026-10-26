# NAP (agent-platform) 学习资源

## Knowledge

### 一手资源（本仓库内）
- [NAP 官方概念文档](https://docs.neutree.ai/nap/) — 本地：`docs-site/src/content/docs/zh-cn/concepts/`
  overview / agent-and-workspace / agent-anatomy / triggers-and-routes / afs / memory-store / teamwork / builder-mode / optimize。中文版齐全，与代码同仓维护，是最高信任度的第一入口。
- `README.md`（仓库根）
  三句话产品定位 + 组件表 + "where to start reading"。含罕见的诚实条款（哪些还没做完）。
- `control-plane/src/routes/` + `control-plane/src/services/`
  API 面与编排层。官方推荐的第一个阅读入口。
- `internal/k8s-provider/workspace-spec.ts`
  pod 形状的唯一真相源：PVC/AFS/memory 三个挂载、fsGroup、sidecar 布局。
- `control-plane/src/services/chat/executeChat.ts`
  一条 turn 的完整生命周期（租约→容量→唤醒→选副本→POST→SSE 拦截）。
- `control-plane/src/lib/workspace-address.ts`
  cp 找 pod 的路由缝：static Service vs auto-scaling headless DNS vs 远程隧道。
- `self-host/manifests/nfs-server.yaml` + `self-host/install.sh`
  存储栈真相：单节点 NFS 单点的明示。

### 外部协议与平台
- [MCP 规范](https://modelcontextprotocol.io/specification) — 工具/资源/传输的权威定义
  NAP 的整个中间件层（`control-plane/src/mcp/`）建立在其上。学到 MCP 工具注册、stdio/SSE 传输时读。
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/) — Zed 主导的 agent↔客户端协议
  NAP 用一个 ACP adapter 让三种 core 共享同一 server 形状（`internal/acp-adapter/`）。学"可换引擎"缝时读。
- [K8s: StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) — 稳定网络标识与有序性的官方解释
  auto-scaling workspace 用它做 per-replica DNS。学员 K8s 浅，作为随用随学的锚点。
- [K8s: Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) — PV/PVC/StorageClass 绑定与 reclaim 语义
  理解 NAP 数据分层的前提。
- [K8s: Service 无头模式](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)
  为什么 auto-scaling 不用 VIP（round-robin 破坏 session 亲和）。

## Wisdom (Communities)

- [NAP Discord](https://discord.gg/MnsQ73d8dq)（README 提供）
  平台作者的直接答疑处。学员到达"评估平台"阶段后可去验证设计意图。
- 待补：agent 平台设计的高信噪比社区（候选：MCP 官方 Discord、Hacker News 上 agent infra 讨论）——学员未表态是否加入，暂不推送。

## Gaps
- 没有找到 NAP 的 ADR/设计决策记录——设计动机只能从代码注释（质量很高）和 Discord 反推
- 多集群/BYOI（远程 runner 隧道）的官方文档薄弱，主要靠 `env-runner-k8s/` + `internal/env-tunnel/` 源码
