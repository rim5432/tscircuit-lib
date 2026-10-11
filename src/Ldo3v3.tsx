import type { CommonLayoutProps } from "tscircuit"

export interface Ldo3v3Props extends CommonLayoutProps {
  /** 稳压器实例名，同时作为内部元件命名前缀，例如 "REG" */
  name: string
  /** 输入端网络，默认 net.VIN */
  inputNet?: string
  /** 输出端网络，默认 net.VOUT */
  outputNet?: string
  /** 地网络，默认 net.GND */
  groundNet?: string
  /** 输入侧去耦电容，默认 10uF */
  inputCapacitance?: string
  /** 输出侧去耦电容，默认 22uF */
  outputCapacitance?: string
  /** 器件型号，默认 AMS1117-3.3 */
  partNumber?: string
  /** 封装，默认 sot223 */
  footprint?: string
}

/**
 * 3.3V LDO 稳压子电路：稳压芯片 + 输入/输出去耦电容。
 *
 * 引脚按 SOT-223 排列：pin1=GND, pin2=VOUT, pin3=VIN, pin4=VOUT(散热片)。
 *
 * ```tsx
 * <Ldo3v3 name="REG" />
 * ```
 */
export const Ldo3v3 = ({
  name,
  inputNet = "net.VIN",
  outputNet = "net.VOUT",
  groundNet = "net.GND",
  inputCapacitance = "10uF",
  outputCapacitance = "22uF",
  partNumber = "AMS1117-3.3",
  footprint = "sot223",
  ...layout
}: Ldo3v3Props) => {
  return (
    <group name={name} {...layout}>
      {/* 位号前缀必须符合类型约定：芯片 U_*、电容 C_* */}
      <chip
        name={`U_${name}`}
        footprint={footprint}
        manufacturerPartNumber={partNumber}
        pinLabels={{
          pin1: "GND",
          pin2: "VOUT",
          pin3: "VIN",
          pin4: "VOUT_TAB",
        }}
        connections={{
          pin1: groundNet,
          pin2: outputNet,
          pin3: inputNet,
          pin4: outputNet,
        }}
      />
      <capacitor
        name={`C_${name}_IN`}
        capacitance={inputCapacitance}
        footprint="0805"
        connections={{ pin1: inputNet, pin2: groundNet }}
      />
      <capacitor
        name={`C_${name}_OUT`}
        capacitance={outputCapacitance}
        footprint="0805"
        connections={{ pin1: outputNet, pin2: groundNet }}
      />
    </group>
  )
}
