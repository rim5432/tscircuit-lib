# models/ — 共享 3D 模型

放**多块板共用**的 3D 模型。只在某一块板上用的，放 `boards/<板名>/models/`。

## 用法

`.glb` / `.step` 这类文件按**静态资源**导入，拿到的是 URL 字符串，
交给 `<cadmodel modelUrl={...} />`：

```tsx
import sot223Url from "../models/SOT-223.step"

<chip
  name="U1"
  footprint="sot223"
  cadModel={<cadmodel modelUrl={sot223Url} />}
/>
```

> **已在本仓库实测**：本地 `.glb` 经相对路径导入并传给 `modelUrl` 后，
> `bun run build` 正常通过（退出码 0）。

挂到整板/机械件上（如螺丝装在安装孔里）用
`<assembly.device>` + `<assembly.subassembly>`，参考官方
「Mounting 3D models to a board」，配合 `zOffsetFromSurface` 对齐板面。

## 格式选择

| 格式 | 什么时候用 |
| --- | --- |
| `.step` | 导出 STEP、对接机械 CAD 时保真度最高，**首选** |
| `.glb` | 只需要网页 3D 预览，单文件最省事 |
| `.obj` / `.stl` / `.wrl` | 兼容老资源 |

命名与料号对齐：`AMS1117-3.3.step`、`NE555.glb`。

## 体积提醒

STEP/GLB 动不动几 MB，按这个优先级来：

1. **能不用文件就不用** —— `<cadmodel model="soic8" />` 这类内置模型
   （modelprinter 提供）覆盖了绝大多数常见封装，零体积。
2. 确实要精确外形时只留 `.step`，需要预览再 `bun run build:3d` 生成图片。
3. 大文件走 Git LFS（先在 `.gitattributes` 里 track，再装 LFS，顺序别反）。

## 从哪来

- 厂商官网 CAD 下载页（TI / Analog Devices / Microchip 基本都有 STEP）
- JLCPCB 元件页：`bun x tsci import "C2934569" --jlcpcb --download`
  会把 `.obj` / `.step` 一起落到该板的 `imports/` 目录
