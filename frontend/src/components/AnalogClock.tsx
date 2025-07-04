import Clock from "react-clock"
import "react-clock/dist/Clock.css"

type Props = {
  now: number
  isNow: boolean
  manualTime: string
}


const AnalogClock = ( {now, isNow, manualTime}: Props) => {

  return (
    <div className="self-center">
      <Clock 
        className="bg-white rounded-full"
        value={isNow ? new Date(now) : new Date(manualTime)}/>
    </div>
  )
}

export default AnalogClock