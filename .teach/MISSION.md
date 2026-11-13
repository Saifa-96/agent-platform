# Mission: 从零重建一个 agent-platform（以 NAP 为参考实现）

## Why
学员要为公司从零构建一个 agent platform——托管、伸缩、供给工具能力的多租户 agent 基础设施。开源的 Neutree agent-platform（NAP）是参考实现与解剖标本：吃透它的构建顺序和设计取舍，然后自己写一个。

## Success looks like
- 不看资料，按施工顺序从零讲出 NAP 的每一层：为什么这个组件存在、它解决了上一层的什么缺口
- 分阶段把自己的平台写出来：裸 agent → 期望状态接管 → 平台骨架（chat API/SSE/会话）→ 工具能力层（MCP）→ 生产化，每阶段有可验收的交付物
- 对每个关键设计决策（两种 serving、存储分层、MCP 中转、可换引擎）能说出 trade-off，并决定自建版照抄还是换方案

## Constraints
- 自底向上、小模块逐个击破；每课只讲一个概念、≤15 分钟
- K8s 已补齐（guangzhengli 全教程 + 本课程基础件 1–7 + 实操）
- 全部行文用标准书面中文；专名不翻译，首现解释名字来历
- butterfly 与本任务无关（仅作为学员熟悉的引擎对照锚点出现在课文中）

## Out of scope
- 给 NAP 上游贡献代码；K8s 认证级深度；前端组件实现细节；运维手册级 self-host 细节
