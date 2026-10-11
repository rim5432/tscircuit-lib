import type { CommonLayoutProps } from "tscircuit"

export interface StatusLedProps extends CommonLayoutProps {
  /**
   * 指示灯实例名。同时作为内部元件命名的前缀，
   * 因此在同一块板内必须唯一（例如 "PWR"、"BLINK"）。
   */
  name: string
  /** 限流电阻阻值，默认 330Ω */
  resistance?: string
  /** LED 颜色 */
  color?: "red" | "green" | "blue" | "yellow" | "white"
  /** LED 封装，默认 0603 */
  ledFootprint?: string
  /** 限流电阻封装，默认 0402 */
  resistorFootprint?: string
  /** LED 阳极所连网络，需带 net. 前缀，例如 "net.OUT" */
  positiveNet: string
  /** LED 阴极所连网络，默认接地 */
  negativeNet?: string
}

/**
 * 电源/状态指示灯：一颗限流电阻串联一颗 LED。
 *
 * ```tsx
 * <StatusLed name="PWR" color="green" positiveNet="net.VCC" />
 * ```
 */
export const StatusLed = ({
  name,
  resistance = "330",
  color = "red",
  ledFootprint = "0603",
  resistorFootprint = "0402",
  positiveNet,
  negativeNet = "net.GND",
  ...layout
}: StatusLedProps) => {
  const anodeNet = `net.${name}_ANODE`

  return (
    <group name={name} {...layout}>
      {/* 位号前缀必须符合类型约定：电阻 R_*、LED D_* */}
      <resistor
        name={`R_${name}`}
        resistance={resistance}
        footprint={resistorFootprint}
        connections={{ pin1: positiveNet, pin2: anodeNet }}
      />
      <led
        name={`D_${name}`}
        color={color}
        footprint={ledFootprint}
        connections={{ anode: anodeNet, cathode: negativeNet }}
      />
    </group>
  )
}
