# 重建路线图：从零写一个 agent-platform（分阶段）

> 原则：每阶段只加一层，交付一个**能跑、能验收**的东西；下一阶段被本阶段的真实缺口驱动，而不是被规划驱动。
> 对应关系：本路线图是第 8 课"施工八步"的工程化落地。NAP 是参考实现：每一步先看 NAP 怎么做（读它的代码），再写自己的版本——抄设计还是换方案，每阶段做一次明确决策。

## 阶段 0 · 底座 ✅（已完成）

本地 k3d 集群 + 基础件七课知识。随时 `k3d cluster create` 拉起实验场。

## 阶段 1 · 能聊天的裸 agent（当前阶段）

**目标**：一个 Deployment（单副本）跑着 agent 容器，Service 暴露，port-forward 后 curl 能聊起来（SSE 流式回复）。

**明确不需要**（防过度设计）：PVC 持久化（会话存内存，重启即忘——故意的）、PG、MCP、多副本、租户、容量门、Ingress。NAP 施工第 1 步砍到最少。

**任务卡**：`exercises/0002-bare-agent-chat/TASK.md`

## 阶段 2 · 期望状态接管（对应 NAP 第 2 步）

缺口：agent 的生灭用 kubectl 手工管理，没有"账本"。
交付：一张 workspace 期望表 + 一个收敛脚本（练习 0001 的 run.ts 进化版：create/wait/destroy 管真 agent）；PVC 挂上 /workspace（持久化在此引入——会话文件活过 pod 重启）。
读 NAP：write.ts 的 Control inversion + env-runner-k8s 的 reconcile。

## 阶段 3 · 平台骨架：chat API 与会话真身（对应 NAP 第 3、4、7 步）

缺口：会话真身在 pod 内存里（重启即忘的债要还了）；入口裸奔，多会话并发无治理。
交付：自己的 chat API——SSE 拦截器（流式响应穿平台、消息落 PG）、会话租约（一个会话同时一个 turn）、副本寻址。文件交付先 port-forward 凑合，dufs 式文件服务列为可选。
读 NAP：executeChat.ts、lib/sse.ts、session-turn/turn-gate。

## 阶段 4 · 能力插座：工具层（对应 NAP 第 6 步）

缺口：agent 需要沙箱、文件共享等能力，而平台不该把它们焊进 agent 容器。
交付：把平台工具做成 MCP 服务器（先做 1-2 个：沙箱或文件操作），agent 侧接入；工具按请求注册的最小版。
读 NAP：mcp/tools.ts、internal/mcp-forward。

## 阶段 5 · 生产化（对应 NAP 第 5、8 步）

缺口：成本（闲置烧钱）、多入口、隔离。
交付：static/auto-scaling 两种 serving（StatefulSet+RWX+headless 的完整链条只在需要多副本时引入）；channels（webhook/定时）；容量门与唤醒。
读 NAP：static/auto-scaling-workload、workspace-autostart、channel-gateway。

---

## 决策记录

- 2026-11-11 确立分阶段路线；重建对象是**自己的 agent-platform**（NAP 为参考实现），与 butterfly 无关；阶段 1 排除 MCP/持久化/租户，只交付"K8s 上能聊天的 agent"。
