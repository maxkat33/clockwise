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
  1: "w-52 h-52 md:w-60 md:h-60 lg:w-80 lg:h-80",
  2: "w-38 h-38 md:w-50 md:h-50 lg:w-70 lg:h-70",
  3: "w-22 h-22 md:w-30 md:h-30 lg:w-60 lg:h-60",
  4: "w-24 h-24 md:w-36 md:h-36 lg:w-50 lg:h-50"
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