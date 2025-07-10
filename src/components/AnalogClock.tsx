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
  1: "w-50 h-50 md:w-66 md:h-66 lg:w-70 lg:h-70 xl:w-72 xl:h-72",
  2: "w-34 h-34 md:w-48 md:h-48 lg:w-62 lg:h-62 xl:w-70 xl:h-70",
  3: "w-22 h-22 md:w-30 md:h-30 lg:w-46 lg:h-46 xl:w-60 xl:h-60",
  4: "w-24 h-24 md:w-36 md:h-36 lg:w-38 lg:h-38 xl:w-50 xl:h-50"
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