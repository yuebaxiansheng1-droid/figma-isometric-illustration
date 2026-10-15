# Figma Isometric Illustration

**让 Codex 根据参考图或场景描述，在 Figma 中创建可编辑的等距 / 轴测 2.5D 插画。**

适合模块化系统场景、设备与工具、立体图标、车辆建筑、分层底座、标签和地面网格。支持从零构建、参考图复刻，以及已有场景的局部精修。

[快速开始](#快速开始) · [使用示例](#使用示例) · [需要准备什么](#需要准备什么) · [文件与脚本](#文件与脚本) · [常见问题](#常见问题)

## 这个 Skill 能做什么

- **参考图驱动**：分析构图、比例、轴向、材质与遮挡，再构建可编辑场景。
- **统一空间关系**：物体、端口、按钮、文字标签与地面元素遵循各自承载面的投影。
- **真实厚度与连续曲面**：分别构建顶面、连续侧壁和必要的内侧面，处理圆角、凹槽与洞口。
- **复用与局部修改**：重复底座和标签可组织为组件；修改时保留用户已完成的手动调整。
- **渲染验收**：同时检查整体构图和放大细节，修正比例、接缝、光影和遮挡问题。

主要交付为 Figma 中的原生形状、可编辑矢量、文字、组件与效果，并附目标 Frame 链接及完成说明。普通 UI 页面、纯流程图和仅生成整张位图的任务不属于本 Skill 的主要范围。

## 使用环境

| 项目 | 要求 |
| --- | --- |
| 运行环境 | 支持本地 Skill 的 Codex 环境 |
| Figma 连接 | 已连接并授权可读写目标文件的 Figma 工具，能调用 `use_figma` |
| 基础配套技能 | 当前环境中的 `figma:figma-use` |
| 创建组件时 | 同时需要 `figma:figma-generate-library` |
| 新建 Figma 文件时 | 同时需要 `figma:figma-create-new-file` |
| Node.js | 仅在本地单独运行辅助脚本时需要 |

本仓库提供插画工作流、参考文档和几何脚本。Figma 连接、账号授权及配套 Figma 技能需要在使用环境中另行准备；安装本 Skill 不会自动安装这些能力。

## 快速开始

### 1. 安装 Skill

推荐在 Codex 对话中发送：

```text
$skill-installer
请从 https://github.com/yuebaxiansheng1-droid/figma-isometric-illustration
安装仓库根目录的 Skill，安装名称为 figma-isometric-illustration。
```

也可以手动克隆到个人技能目录。按照 [OpenAI 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)，当前个人技能目录为 `~/.agents/skills`。

Windows / PowerShell：

```powershell
$skillParent = Join-Path $env:USERPROFILE ".agents\skills"
New-Item -ItemType Directory -Force -Path $skillParent | Out-Null
git clone https://github.com/yuebaxiansheng1-droid/figma-isometric-illustration.git (Join-Path $skillParent "figma-isometric-illustration")
```

macOS / Linux：

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/yuebaxiansheng1-droid/figma-isometric-illustration.git ~/.agents/skills/figma-isometric-illustration
```

选择一种安装方式即可。使用 `$skill-installer` 时，以它实际配置的安装目录为准。Codex 会自动发现新安装的技能；如果没有显示，可重启 Codex 后检查。

### 2. 准备目标文件与参考

连接 Figma，确认目标文件可编辑，并提供文件或 Frame 链接。参考图可以作为对话附件；原创场景可以直接用文字说明物体与布局。

### 3. 在对话中调用

```text
$figma-isometric-illustration
请根据我附上的参考图，在以下 Figma 文件中创建可编辑的 2.5D 轴测插画：
Figma 文件：<粘贴你的文件或 Frame 链接>
保留参考图的布局、比例和配色，完成后检查整体渲染与关键细节，返回目标 Frame 链接。
```

## 使用示例

### 根据参考图复刻

```text
$figma-isometric-illustration
参考图已附上，目标 Figma 文件：<文件链接>。
请复刻这张设备场景插画，重点保持主体比例、底座厚度、端口位置和光影方向。
主体需要可编辑，标签使用可编辑文字。请完成整图和局部渲染检查。
```

### 根据文字创建场景

```text
$figma-isometric-illustration
目标 Figma 文件：<文件链接>。
创建一个浅色背景的汽车维修站轴测场景，画布 1600 × 1000。
包含维修车间、两辆汽车、接待柜台和道路标线，使用白、灰、青绿配色。
请统一尺度、地面轴向和光源，车辆、门洞及柜台需要清楚表达厚度和遮挡关系。
```

### 精修已有插画

```text
$figma-isometric-illustration
目标 Frame：<Frame 链接>，参考图已附上。
请修正圆形按钮的连续侧壁、车顶与车窗的比例，以及底座侧面的渐变方向。
保留现有布局和我手动修改的内容，完成后给出修改说明与最终渲染。
```

## 需要准备什么

| 信息 | 建议提供的内容 |
| --- | --- |
| 目标位置 | Figma 文件链接；修改已有内容时提供具体 Frame 或节点链接 |
| 视觉依据 | 参考图片，或明确的场景与风格描述 |
| 场景内容 | 物体清单、模块数量、标签文字、连接关系 |
| 画布与风格 | 尺寸或比例、配色、背景、光源方向等已有要求 |
| 修改重点 | 比例、角度、厚度、曲面、材质等需要优先解决的问题 |

复刻任务优先沿用参考图的实际轴向，不固定使用 ±30°。不可辨认的文字、缺失的业务关系和目标文件信息需要确认；一般几何细节由任务与参考图推断。

## 工作方式与质量要求

1. 分析元素与构图，确定实体、洞口、依附面和前后关系。
2. 建立统一的投影基向量，在物体局部平面绘制后再投影。
3. 完成代表性模块，检查比例与几何，再复用为同类组件。
4. 构建连续侧壁、真实厚度、内壁、标签、阴影及必要的地面元素。
5. 对照参考图检查整体与局部渲染，修正已发现的具体差异。
6. 交付目标 Frame 链接、完成内容、必要取舍及验收情况。

轮廓通过基本形状、几何投影和主动设计的贝塞尔曲线构建，禁止阈值分割、自动描摹或位图转路径。高还原度任务以实际可见差异和渲染检查为依据；未定义并执行测量方法时，不报告还原百分比。

## 文件与脚本

```text
figma-isometric-illustration/
|-- README.md
|-- SKILL.md
|-- agents/
|   `-- openai.yaml
|-- references/
|   |-- geometry.md
|   |-- reference-fidelity.md
|   `-- vehicles-and-architecture.md
`-- scripts/
    |-- bezier-extrusion.js
    `-- isometric-vehicles.js
```

| 文件 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | 技能入口、适用范围、制作流程和验收要求 |
| [agents/openai.yaml](agents/openai.yaml) | 展示名称、简短描述及默认调用提示 |
| [geometry.md](references/geometry.md) | 曲线投影、连续挤出、按钮状态、标签与洞口 |
| [reference-fidelity.md](references/reference-fidelity.md) | 参考坐标对照、比例修正、材质与高还原度验收 |
| [vehicles-and-architecture.md](references/vehicles-and-architecture.md) | 车辆、建筑门洞、玻璃、家具、道路与标牌 |
| [bezier-extrusion.js](scripts/bezier-extrusion.js) | 解析闭合路径、投影、圆角轮廓及连续侧壁几何 |
| [isometric-vehicles.js](scripts/isometric-vehicles.js) | 四种可修改的标准轴测车辆 SVG 底稿 |

辅助脚本是纯 JavaScript，返回几何或 SVG，本身不读写 Figma。Node 环境可通过 `require` 使用；Figma 环境按文档将源码嵌入执行脚本。车辆底稿仅用于适合这些车型和标准轴向的任务，其他车型、比例与角度需要按场景调整。

## 常见问题

**安装后就能直接操作 Figma 吗？** 需要先连接支持读写的 Figma 工具，并准备上方列出的配套技能及文件权限。

**没有参考图也能使用吗？** 可以。提供物体、布局、文字、画布与风格要求即可创建原创场景。

**可以只修改已有设计的一部分吗？** 可以。提供目标 Frame 或节点链接，并说明修改重点及需保留的内容。

**生成的内容可以继续编辑吗？** 主要元素按原生形状、可编辑矢量与文字组织。若遇到工具限制，交付时需要明确说明取舍。

**是否固定为暗色风格或 ±30°？** 配色与轴向由参考图和任务决定，脚本中的标准轴测示例不构成所有场景的固定要求。
