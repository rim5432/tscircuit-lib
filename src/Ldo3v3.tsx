/**
 * 3.3V LDO regulator subcircuit: regulator chip + input/output decoupling caps.
 * Pinout follows SOT-223: pin1 = GND, pin2 = VOUT, pin3 = VIN, pin4 = VOUT tab.
 *
 * ```tsx
 * <Ldo3v3 name="REG" />
 * ```
 */
import type { CommonLayoutProps } from "tscircuit"

export interface Ldo3v3Props extends CommonLayoutProps {
  /** Instance name; also the refdes prefix of the internal parts, e.g. "REG" */
  name: string
  /** Input net, default net.VIN */
  inputNet?: string
  /** Output net, default net.VOUT */
  outputNet?: string
  /** Ground net, default net.GND */
  groundNet?: string
  /** Input decoupling capacitor, default 10uF */
  inputCapacitance?: string
  /** Output decoupling capacitor, default 22uF */
  outputCapacitance?: string
  /** Part number, default AMS1117-3.3 */
  partNumber?: string
  /** Footprint, default sot223 */
  footprint?: string
}

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
