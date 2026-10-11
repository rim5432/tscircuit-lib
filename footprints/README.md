# footprints/ — 共享自定义封装

放**多块板共用**的封装资料。只在某一块板上用的，放 `boards/<板名>/footprints/`。

## 三种拿封装的方式

### 1. 官方库能直接引（首选，本目录连文件都不用放）

```tsx
<resistor name="R1" resistance="10k" footprint="kicad:Resistor_SMD/R_0402_1005Metric" />
<led name="D1" footprint="jlcpcb:C2040" />
```

`kicad:` / `jlcpcb:` 前缀会让 tscircuit 自动去取对应封装。
`kicad:` 后的路径 = KiCad 库里的 `<Library>/<FootprintName>`。
需要补全和编译期校验时可用 `kicadFootprintStrings`。

### 2. 厂商只给了 `.kicad_mod` → 转成 TSX（本目录的主要用途）

原始文件保留以便追溯，转换产物供代码引用：

```bash
bun x tsci convert packages/lib/footprints/MyPart.kicad_mod \
  --name MyPart --output packages/lib/footprints/MyPart.tsx
```

产物是一个 `<chip>` 组件（内含完整 `<footprint>`），直接当器件用：

```tsx
import { MyPart } from "../footprints/MyPart"

<MyPart name="U9" connections={{ pin1: "net.VCC", pin2: "net.GND" }} />
```

> **已在本仓库实测**：本地 `.kicad_mod` 经 `tsci convert` 后，
> 在 `bun run build` 下能正常构建出 Circuit JSON（退出码 0）。

### 3. 只借用封装形状

转换产物里的 `<footprint> ... </footprint>` 那一段可以整块复制进
任意元件的 `footprint` prop（官方文档写法）：

```tsx
<capacitor
  name="C1"
  capacitance="100uF"
  footprint={
    <footprint>
      <smtpad portHints={["1"]} pcbX="-0.9mm" width="1mm" height="1.2mm" shape="rect" />
      {/* ... */}
    </footprint>
  }
/>
```

## 命名

- `.kicad_mod`：**保持原文件名**，与 KiCad 库里的 `FootprintName` 一致，
  方便日后回官方库核对、重新转换。
- 转换出的 TSX：同名转 PascalCase，`LED_0603_1608Metric` → `Led0603.tsx`。

## 相关

- 只想改封装样式（焊盘尺寸、丝印）而不换封装本身 → 用 `pcbSx`
- 整块 KiCad 板子导入 → `kicad-component-converter` 或
  `<subcircuit circuitJson={...} />`，见官方「Importing from KiCad」
