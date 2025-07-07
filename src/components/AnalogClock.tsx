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
    <div className="self-center">
      <Clock 
        className="bg-white rounded-full"
        value={clockDate}
      />
    </div>
  )
}

export default AnalogClock