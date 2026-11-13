// mini env-runner — NAP internal/k8s-provider/static-workload.ts 的缩小复刻
// 用法: bun run.ts <create|wait|proof|kill|destroy> <name>
// 规则: 不写 YAML 文件——用代码构造 JSON 对象，管道喂给 kubectl apply -f -
// 参考: exercises/0001-mini-env-runner/TASK.md

const [cmd, name] = process.argv.slice(2)
if (!cmd || !name) {
  console.error('usage: bun run.ts <create|wait|proof|kill|destroy> <name>')
  process.exit(1)
}

const NS = process.env.DEMO_NS ?? 'default'
const LABEL = { app: `mini-env-${name}` }
const PVC_NAME = `${name}-workspace` // NAP 同款命名法：workspacePvcName()

/** 跑一条 kubectl 命令；input 非空则喂给 stdin，返回 stdout。 */
async function kubectl(args: string[], input?: string): Promise<string> {
  const proc = Bun.spawn(['kubectl', '-n', NS, ...args], {
    stdin: input ? 'pipe' : 'ignore',
    stdout: 'pipe',
    stderr: 'pipe',
  })
  if (input) {
    proc.stdin.write(input)
    proc.stdin.end()
  }
  const [out, err] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  const code = await proc.exited
  if (code !== 0) throw new Error(`kubectl ${args.join(' ')} failed:\n${err}`)
  return out
}

/** 把一个 JSON 对象 apply 进集群（K8s API 收 JSON——YAML 只是给人写的格式）。 */
const apply = (obj: unknown) => kubectl(['apply', '-f', '-'], JSON.stringify(obj))

// ─── TODO 1: buildPvc() ────────────────────────────────────────────────
// 返回 PVC 对象: apiVersion v1, kind PersistentVolumeClaim,
// metadata.name = PVC_NAME, metadata.labels = LABEL,
// spec: accessModes ["ReadWriteOnce"]，resources.requests.storage 为 "1Gi"
// （storageClassName 省略 = 使用集群默认的供应链）
function buildPvc(): object {
  // TODO: 构造并返回对象（对照 L05 课内 YAML）
  throw new Error('TODO 1')
}

// ─── TODO 2: buildDeployment() ─────────────────────────────────────────
// 返回 Deployment 对象: apps/v1, 单副本, selector/template.labels = LABEL,
// 容器 busybox:1.36, 命令往 /data/proof.txt 追加 "hello from $(hostname) at $(date)"
// 然后 sleep 3600；把 PVC 挂到 /data
// （对照第 3 课的 YAML 结构，以及你在第一阶段手写过的 a/deployment.yaml）
function buildDeployment(): object {
  // TODO: 构造并返回对象
  throw new Error('TODO 2')
}

// ─── TODO 3: waitReady() ───────────────────────────────────────────────
// 每 1s 查一次 pod（labelSelector），Ready 即返回；90s 超时抛错。
// Ready 判据: phase === 'Running' 且所有 containerStatuses 的 ready 为 true。
// （NAP 的 pollHealth 同款思想: getWorkspaceAddress + /health 轮询, 90s 预算）
async function waitReady(): Promise<string> {
  // TODO: 返回 Ready pod 的名字
  throw new Error('TODO 3')
}

// ─── TODO 4: proof() ───────────────────────────────────────────────────
// exec 进入 pod 读取 /data/proof.txt，把内容原样打印并返回。
async function proof(): Promise<string> {
  // TODO（提示: kubectl exec deploy/<name> -- cat /data/proof.txt）
  throw new Error('TODO 4')
}

// ─── TODO 5: killPod() / destroyAll() ──────────────────────────────────
// killPod: 删除带 LABEL 的 pod（人为制造一次故障，等自愈）
// destroyAll: 删除 Deployment 和 PVC（NAP destroy() 的缩小版；两个都要删，顺序不限）
async function killPod(): Promise<void> {
  // TODO
  throw new Error('TODO 5a')
}
async function destroyAll(): Promise<void> {
  // TODO
  throw new Error('TODO 5b')
}

// ─── 命令分发 ──────────────────────────────────────────────────────────
switch (cmd) {
  case 'create':
    console.log(await kubectl(['apply', '-f', '-'], JSON.stringify(buildPvc())))
    console.log(await kubectl(['apply', '-f', '-'], JSON.stringify(buildDeployment())))
    break
  case 'wait':
    console.log(`ready: ${await waitReady()}`)
    break
  case 'proof':
    console.log(await proof())
    break
  case 'kill':
    await killPod()
    console.log('pod 已删除 —— 接下来执行 wait 观察自愈')
    break
  case 'destroy':
    await destroyAll()
    console.log('已销毁（Deployment + PVC）')
    break
  default:
    console.error(`未知命令: ${cmd}`)
    process.exit(1)
}
