# 修正：重建对象是自己的 agent-platform，与 butterfly 无关

2026-11-11 学员再次澄清（修正 LR-0006 的误读）：重建的对象是 **agent-platform 本身**——公司要从零构建自己的 agent 基础设施，NAP 是参考实现与解剖标本。butterfly 与本任务无关，只是学员日常工作熟悉的公司产品，课程中保留它仅作"引擎侧对照"的教学锚点。

**Status**: active（取代 LR-0006 的"基于 NAP 重建 butterfly"表述）

**Implications**:
- 路线图（rebuild/ROADMAP.md）重写：五阶段全部是**自建**自己的平台（裸 agent → 期望状态 → chat 骨架 → 工具层 → 生产化），每阶段"读 NAP 对应文件 → 抄设计/直接用/fork 三选一并记录决策"；不再是"阶段 3 转向采用 NAP 本体"，也不是 butterfly 迁移
- 第 8 课"改造接缝"一节替换为"与 NAP 的关系（三选一）"决策表
- MISSION 同步重写
- 钻探层选课按自建需求排序：MCP 中转（工具层自建）、两种 serving（多副本链条）、ACP（可换引擎的适配器自写）
