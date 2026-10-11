# @mytscircuit/lib

可复用的 tscircuit 元件 / 子电路库。**独立仓库**，其他板级项目按 **git tag** 引用。

## 现有元件

| 导出 | 说明 | 主要 props |
| --- | --- | --- |
| `StatusLed` | 限流电阻 + LED 的电源/状态指示灯 | `name`、`positiveNet`、`negativeNet`、`color`、`resistance`、`ledFootprint` |
| `Ldo3v3` | 3.3V LDO 子电路（SOT-223 稳压芯片 + 输入/输出去耦电容） | `name`、`inputNet`、`outputNet`、`groundNet`、`inputCapacitance`、`outputCapacitance`、`partNumber` |

## 在板级项目里引用

```jsonc
// 该项目 package.json
"dependencies": {
  "@mytscircuit/lib": "github:rim5432/tscircuit-lib#v0.1.0"
}
```

```tsx
import { Ldo3v3, StatusLed } from "@mytscircuit/lib"

export default () => (
  <board>
    <Ldo3v3 name="REG" />
    <StatusLed name="PWR" color="green" positiveNet="net.VOUT" />
  </board>
)
```

> private 仓库的 git 依赖靠 `gh auth git-credential` 认证（本机已配好）。
> CI 里需要注入有 `repo` 权限的 token，见各项目 `.github/workflows/`。

## 发版

板级项目引用的是 **tag**，所以改完要让别人用上，必须打 tag：

```bash
# 1. 改 src/ 下的元件
# 2. 更新 package.json 的 version
# 3. 提交并打 tag
git commit -am "feat: 新增 XXX 元件"
git tag v0.1.1
git push && git push --tags
# 4. 用到它的项目把依赖改成 #v0.1.1 再 bun install
```

**不要**在项目里引用分支（`#main`）——那样每次 `bun install` 结果都可能变，
构建不可复现。

## 命名约定

元件内部子元件名 = **正确位号前缀** + 传入的 `name`，例如 `R_PWR`、`D_PWR`、
`U_REG`、`C_REG_IN`。前缀必须符合类型约定（电阻 `R_`、电容 `C_`、LED/二极管 `D_`、
芯片 `U_`），否则板上构建会报 reference designator 错误；带上 `name` 则保证
同一块板内实例化多次也不重名。

## 新增元件

1. 在 `src/` 下新建 `MyPart.tsx`，导出组件与 props 类型。
2. 在 `src/index.tsx` 中 `export`。
3. `bun install && bun run typecheck` 确认类型无误。
4. 按上面的「发版」流程打 tag。

组件内部用 `<group name={name}>` 包裹。**不要**用 `<subcircuit>`——它是强隔离
命名空间，内部 `net.*` 与外部不连通，跨边界还得用全限定选择器桥接，
而且不支持 `<port>` 公共接口（实测结论）。

## 目录

```
src/          元件实现，index.tsx 统一导出
footprints/   共享自定义封装（.kicad_mod 原文件 + tsci convert 产物）
models/       共享 3D 模型（.step / .glb）
```
