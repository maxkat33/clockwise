import { useState, useEffect } from "react"

import { getCityData } from "../utils"

import AnalogClock from "./AnalogClock"
import DigitalClock from "./DigitalClock"
import Location from "./Location"

type Props = {
  now: number
  isNow: boolean
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  is24h: boolean
  refTimestamp: number
  setRefTimestamp: React.Dispatch<React.SetStateAction<number>>
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
  searchKey: string
}

const ClockCard = ({
  now,
  isNow,
  setIsNow,
  is24h,
  refTimestamp,
  setRefTimestamp,
  setLocations,
  searchKey
}: Props) => {

  // state
  
  const [utcOffset, setUtcOffset] = useState<number | null>(null)
  const [timezone, setTimezone] = useState<string>("")

  // useEffects

  useEffect(() => {
    const cityData = getCityData(searchKey)

    if (cityData) {
      setUtcOffset(cityData.utcOffset)
      setTimezone(cityData.timezone)
    } else {
      setUtcOffset(null)
      setTimezone("")
    }
  }, [searchKey])
  
  const ready = timezone.length > 0 && typeof utcOffset === "number"

  return (
    <div className="
      flex flex-col gap-2 p-3 
    bg-sky-200 shadow-md shadow-sky-300
      rounded-xl 
      hover:shadow-lg hover:shadow-blue-300
      focus:shadow-lg focus:shadow-blue-300
      transition-shadow duration-300 ease-in-out
    ">
      {ready ? (
      <section className="h-full flex flex-col items-center justify-center gap-3">
        <AnalogClock
          now={now}
          isNow={isNow}
          refTimestamp={refTimestamp}
          timezone={timezone}
        />
        <DigitalClock 
          now={now}
          isNow={isNow}
          setIsNow={setIsNow}
          is24h={is24h}
          refTimestamp={refTimestamp}
          setRefTimestamp={setRefTimestamp}
          timezone={timezone}
          utcOffset={utcOffset}
        />
        <Location
          utcOffset={utcOffset}
          searchKey={searchKey}
          setLocations={setLocations}
        />
      </section>
      ) : (
        <p>Loading timezone info...</p>
      )}
    </div>
  )
}

export default ClockCard