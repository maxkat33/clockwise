import Clock from "react-clock"
import "react-clock/dist/Clock.css"

import { formatUtcTimestampToDate } from "../utils"

type Props = {
  now: number
  isNow: boolean
  refTimestamp: number
  timezone: string
}

const AnalogClock = ( {now, isNow, refTimestamp, timezone}: Props) => {

  let clockDate
  if (timezone) {
    clockDate = formatUtcTimestampToDate(isNow ? now : refTimestamp, timezone)
  }

  return (
    <div className="self-center w-40 h-40 bg-slate-50 rounded-[50%]">
      <Clock
        className="react-clock w-full h-full"
        value={clockDate}
      />
    </div>
  )
}

export default AnalogClock