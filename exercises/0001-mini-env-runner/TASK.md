# 练习 0001 · mini env-runner

> 目标：亲手复刻 NAP `static-workload.ts` 的骨架，并用实验证明——**文件比 pod 活得久**。
> 本练习综合第 1 至 5 课：pod 与卷（第 1 课）、期望状态与自愈（第 2 课）、Deployment 与清单（第 3 课）、label 认领（第 3、4 课）、PVC 供给链（第 5 课）。

## 准备环境（三选一，先做这一步）

⚠️ 请勿在生产集群或 butterfly 的沙箱集群里做这个练习。

```bash
# 方案 A（推荐）：k3d 在本地创建一次性集群，自带 local-path 供货程序（RWO，够用）
brew install k3d && k3d cluster create nap-demo && kubectl get sc

# 方案 B：minikube
minikube start

# 方案 C：已有 dev 集群 → 用独立 namespace 隔离
kubectl create ns nap-demo && export DEMO_NS=nap-demo
```

环境验收标准：`kubectl get sc` 能列出一个默认 StorageClass（名字后面带 `(default)` 标记）。

## 第一阶段 · 手写清单（约 30 分钟，必做）

在本目录 `a/` 下手写两份清单文件，完整走一遍第 5 课的 T0 到 T4：

1. **`a/pvc.yaml`** —— PVC：10Gi、ReadWriteOnce，storageClassName 省略（使用集群默认的供应链）
2. **`a/deployment.yaml`** —— 单副本 Deployment：
   - 镜像使用 `busybox:1.36`
   - 容器命令：`sh -c 'echo "hello from $(hostname) at $(date)" >> /data/proof.txt; sleep 3600'`
   - volumeMounts 把 `/data` 挂到你的 PVC 上（claimName）
   - 为 pod 打上 label `app: mini-env-runner`（第 3 课讲过的认领标签）

实验步骤（每一步的观察记录到 `a/OBSERVATIONS.md`，一步一行）：

```bash
kubectl apply -f a/pvc.yaml
kubectl get pvc -w                    # 观察 Pending → Bound（T0 → T1）
kubectl apply -f a/deployment.yaml
kubectl get pods -w                   # 观察它变为 Running（T2）
kubectl exec deploy/mini-env-runner -- cat /data/proof.txt   # 第 1 条记录
kubectl delete pod -l app=mini-env-runner                    # 人为制造一次故障
kubectl get pods -w                   # 观察自愈：新 pod 出现，名字不同（第 2 课）
kubectl exec deploy/mini-env-runner -- cat /data/proof.txt   # ★ 此时应有两代记录
kubectl delete -f a/                  # T4：全部删除。然后再执行 kubectl get pvc 验证
```

**第一阶段验收**：`proof.txt` 里有两条 hostname 不同的记录；OBSERVATIONS.md 记录了 T0 到 T4 每一步的现象。

## 第二阶段 · mini env-runner（主菜，写真正的代码）

补全 `run.ts` 里的五个 TODO。规则：**不写 YAML 文件**——像 NAP 一样用代码构造 JSON 对象，通过管道交给 `kubectl apply -f -`（第 3 课讲过：YAML 只是方便人书写的格式，API 本身接受 JSON）。

```bash
bun run.ts create agent-demo     # 提交 PVC 和 Deployment（TODO 1、2）
bun run.ts wait agent-demo       # 轮询 pod 直到 Ready，超时预算 90 秒（TODO 3，NAP pollHealth 的缩小版）
bun run.ts proof agent-demo      # exec 读取 /data/proof.txt（TODO 4）
bun run.ts kill agent-demo       # 删除 pod，人为制造一次故障（TODO 5）
bun run.ts wait agent-demo       # 观察自愈
bun run.ts proof agent-demo      # ★ 验收：两代记录同时存在
bun run.ts destroy agent-demo    # 全部删除（TODO 5，NAP destroy() 的缩小版）
```

**第二阶段验收**：完整跑完上述命令且没有报错；第二次 `proof` 的输出里有两条 hostname 不同的记录；`kubectl get pvc` 确认 destroy 之后没有残留。

## 提示（卡住时再看，按需逐条取用）

- `kubectl apply -f -` 会从标准输入读取 JSON——用 `Bun.spawn` 时把 stdin 设为 `'pipe'`，写完数据后调用 `end()`
- 判断 pod 是否 Ready：`kubectl get pod -l app=<name> -o json`，然后检查 `items[0].status.phase === 'Running'` 且 `containerStatuses` 里每一项的 `ready` 都为 true
- 读取文件：`kubectl exec deploy/<name> -- cat /data/proof.txt`
- 删除 pod：`kubectl delete pod -l app=<name>`；销毁全部：Deployment 和 PVC 都要删（NAP 的 destroy 删三件套，本练习没有 Service，删两件即可）
- 如果 busybox 镜像拉取失败，可以换成 `alpine:3.20`，命令里的 `sh -c` 写法不变

## 完成之后

回来告诉我两件事：① 哪一步的实际现象和你的预期不一致（这是最有价值的信息）；② 第二阶段的五个 TODO 分别卡了多久。然后我们重做第 5 课的测验，再进入第 6 课（MCP）。
