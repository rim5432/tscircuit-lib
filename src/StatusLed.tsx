/**
 * Power/status indicator: one current-limiting resistor in series with one LED.
 *
 * ```tsx
 * <StatusLed name="PWR" color="green" positiveNet="net.VCC" />
 * ```
 */
import type { CommonLayoutProps } from "tscircuit"

export interface StatusLedProps extends CommonLayoutProps {
  /** Instance name; also the refdes prefix of the internal parts, unique per board (e.g. "PWR") */
  name: string
  /** Current-limiting resistance, default 330 ohm */
  resistance?: string
  /** LED color */
  color?: "red" | "green" | "blue" | "yellow" | "white"
  /** LED footprint, default 0603 */
  ledFootprint?: string
  /** Resistor footprint, default 0402 */
  resistorFootprint?: string
  /** Net tied to the LED anode, with the net. prefix, e.g. "net.OUT" */
  positiveNet: string
  /** Net tied to the LED cathode, default ground */
  negativeNet?: string
}

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
