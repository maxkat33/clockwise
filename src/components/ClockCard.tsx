import { useState, useEffect } from "react"

import AnalogClock from "./AnalogClock"
import DigitalClock from "./DigitalClock"
import Timezone from "./Timezone"

type Props = {
  isNow: boolean
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  is24h: boolean
  manualTime: string
  setManualTime: React.Dispatch<React.SetStateAction<string>>
  coords: [number, number]
  setRefCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>
  locations: Array<[number, number]>
  setLocations: React.Dispatch<React.SetStateAction<Array<[number, number]>>>
}

const ClockCard = ({
  isNow,
  setIsNow,
  is24h,
  manualTime,
  setManualTime,
  coords,
  setRefCoords,
  locations,
  setLocations
}: Props) => {
  
  // each clockcard tracks now itself to avoid re rendering the entire app every second - only the clockcard itself
  const [now, setNow] = useState<number>(Date.now())
  const [timezone, setTimezone] = useState<string>("")
  const [cityCountry, setCityCountry] = useState<string>("")
  
  // function that determines timezone 
  
  // function that converts manual time to manual time formatted to timezone

  // If now === true, update now's state every second so that it is accurate to the exact current time in this timezone
  useEffect(() => {
    // change to incorporate timezone
    if (!isNow) return
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)

  }, [isNow])

  // function to determine timezone from coords

  return (
    <div className="flex flex-col gap-2 p-3 bg-sky-100">
        <AnalogClock
          now={now}
          isNow={isNow}
          manualTime={manualTime}
        />
        {/* <DigitalClock 
          now={now}
          isNow={isNow}
          setIsNow={setIsNow}
          is24h={is24h}
          manualTime={manualTime}
          setManualTime={setManualTime}
          coords={coords}
          setRefCoords={setRefCoords}
          timezone={timezone}
        /> */}
        <Timezone 
          timezone={timezone}
          cityCountry={cityCountry}
          locations={locations}
          setLocations={setLocations}
        />
    </div>
  )
}

export default ClockCard