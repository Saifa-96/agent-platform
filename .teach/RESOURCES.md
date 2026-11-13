# NAP (agent-platform) 学习资源

## Knowledge

### ACP（Agent Client Protocol，2026-11 新增模块）
- [ACP 协议官网 v1 文档](https://agentclientprotocol.com/protocol/v1/overview)
  本课程对齐的版本：v1 = 学员 SDK 2.5 稳定入口的 wire 协议，Zed 现行。逐页读 overview/lifecycle/permissions。
- [ACP 协议官网 v2 文档](https://agentclientprotocol.com/protocol/v2/overview)
  草案雷达（SDK 实验入口，不兼容风险）：只测览差异方向，不对着它写代码。
- **本地权威：agent-hub/internal/acp-adapter/node_modules/@agentclientprotocol/sdk/**
  实际对接版本的类型与迁移文档（MIGRATION_STABLE_UNSTABLE.md、dist/v1/stable/acp.d.ts、dist/schema/types.gen.d.ts）。写代码以它为准，官网当概念字典。

### 中文学习资源（均验证可用）
- [guangzhengli《Kubernetes 教程》](https://guangzhengli.com/courses/kubernetes/)
  中文动手教程：Container → Pod → Deployment → Service → Ingress 全链路，本地环境 minikube，示例应用贯穿全程（2026-10-26 验证，学员推荐）。Pod/Deployment/Service 章可分别作为 L01/L03–04/L05 的课外读物。
- [K8s 官方中文教程「Hello Minikube」](https://kubernetes.io/zh-cn/docs/tutorials/hello-minikube/)
  官方中文动手教程：启动 minikube → 创建 Deployment → 暴露 Service，第 3 课的动手材料（2026-10-26 验证可用）。
- [K8s 官方中文文档「Deployment」](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/)
  与代码同步维护的权威中文材料，第 3 课动手实验的课前阅读。
- [Jimmy Song《Kubernetes Handbook》](https://jimmysong.io/book/kubernetes-handbook/)
  中文开源书稿，适合换角度复述已学概念，工作负载章节选读。
- [K8s 实践课 workshop](https://k8s.yxuefeng.com/workshop/)
  结构化中文动手教程，可选的跟练风格补充。

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
