# 练习 0002 · 裸 agent 上 K8s —— 阶段 1 任务卡

> 目标：一个能聊天的 agent 跑在 K8s 集群里，`kubectl port-forward` 之后 curl 能收到流式回复。
> 这是改造路线图的阶段 1（见 `../../rebuild/ROADMAP.md`），也是练习 0001 的进化版：busybox 换成真 agent，其余一切从简。

## 明确不需要（先读这个，防过度设计）

- ❌ PVC / 持久化：会话存进程内存，pod 重启即忘——**这是故意的**，阶段 2 再引入
- ❌ PostgreSQL、MCP、多副本、StatefulSet、Ingress、dufs、租户、鉴权
- ✅ 只要：单副本 Deployment + ClusterIP Service + 一个能流式回复的 HTTP 服务

## 你要写的东西（三件）

### 1. `agent-server.ts` —— 约 60 行，全自写

用 Bun 起一个 HTTP 服务，满足：

- `GET /health` → 200，`{"ok":true}`（给以后的健康检查用）
- `POST /chat` → 接收 `{"message": "..."}`，调 LLM API，以 **SSE** 流式返回回复
- 会话保存在内存对象里（同一 session_id 的多轮上下文能接上；进程重启全忘——符合本阶段设定）

技术选择自由：
- LLM API 任选现成的（OpenAI 兼容端点 / Anthropic / GLM / Qwen），建议用公司已有的代理，key 从环境变量读
- SSE 格式参考：`data: {"delta":"..."}\n\n`，结尾 `data: [DONE]`

### 2. `Dockerfile` —— 约 10 行

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY agent-server.ts .
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "agent-server.ts"]
```

（可直接用；理解每一行——第 1 课的"图纸"）

### 3. `k8s/manifests.yaml` —— 你写过同款，这次换内容

- Deployment：单副本，镜像 `bare-agent:0.1.0`，env 注入 API key 和 base URL
- Service：ClusterIP，8080 端口
- 记得给 pod 打 label，Service 的 selector 认领它（第 4 课三个名字）

## 实施流程（本地 → 容器 → 集群，三段验证）

```bash
# 阶段 A：先在本地跑通（不碰 K8s）
bun agent-server.ts
curl -N localhost:8080/chat -d '{"message":"你好，介绍一下你自己"}'
# 看到流式输出再往下走

# 阶段 B：容器化
docker build -t bare-agent:0.1.0 .
docker run --rm -p 8080:8080 -e LLM_API_KEY=xxx bare-agent:0.1.0
curl -N localhost:8080/chat -d '...'    # 容器里也要能聊

# 阶段 C：上集群
k3d cluster create bare-agent   # 新集群，干净；或复用现有
k3d image import bare-agent:0.1.0 -c bare-agent   # ★ 第 3 课对照表里那个坑
kubectl apply -f k8s/manifests.yaml
kubectl get pods                  # Running
kubectl port-forward svc/bare-agent 8080:8080
curl -N localhost:8080/chat -d '{"message":"在集群里的第一条消息"}'
```

## 验收标准（三条全过才算阶段 1 完成）

1. `kubectl get pods` 里 agent 单副本 Running，删掉 pod 后**自愈**且能继续聊（Deployment 在工作）
2. port-forward 后 curl 能收到**流式**回复，多轮上下文接得上
3. 能口头回答：这个 pod 里有哪些容器？（1 个——对比 NAP workspace pod 的 3 个，缺的 2 个 sidecar 各是干什么的、什么时候才会需要它们）

## 卡点预告

- k3d 的 image import 忘了做 → pod 卡 ImagePullBackOff（第 3 课讲过）
- 代理环境 EOF → ~/.zshrc 的 no_proxy 那两行（总集篇踩坑清单）
- LLM key 忘了写进 Deployment 的 env → pod 起来了但 /chat 报错——用 `kubectl logs` 看

## 完成之后

回来汇报：验收三条的结果 + `agent-server.ts` 大概写了多少行。然后看 ROADMAP 进阶段 2——你会亲手把"期望状态账本"接上，那正是 NAP Control inversion 注释的活体。
