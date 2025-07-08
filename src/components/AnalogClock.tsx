import Clock from "react-clock"
import "react-clock/dist/Clock.css"

import { formatUtcTimestampToDate } from "../utils"

type Props = {
  now: number
  isNow: boolean
  refTimestamp: number
  timezone: string
  locations: string[]
}

const sizeMap: Record<number, string> = {
  1: "w-80 h-80",  // 80px by 80px
  2: "w-38 h-38",
  3: "w-20 h-20",
  4: "w-20 h-20",
  5: "w-16 h-16",
  6: "w-16 h-16",
  7: "w-16 h-16",
  8: "w-16 h-16",
}

const AnalogClock = ( {now, isNow, refTimestamp, timezone, locations}: Props) => {

  let clockDate
  if (timezone) {
    clockDate = formatUtcTimestampToDate(isNow ? now : refTimestamp, timezone)
  }

  const count = Math.min(locations.length, 8);
  const clockSize = sizeMap[count] || sizeMap[8];

  return (
    <div className={`
      self-center ${clockSize} 
      ${locations.length === 4 ? "mt-4" : ""} 
      bg-slate-100 shadow-lg shadow-slate-400
      rounded-[50%] 
    `}>
      <Clock
        className="w-full h-full react-clock"
        value={clockDate}
      />
    </div>
  )
}

export default AnalogClock