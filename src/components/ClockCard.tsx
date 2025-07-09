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
  locations: string[]
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
  locations,
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

  return (
    <div className={`
      clockCard
      w-full max-w-sm sm:max-w-md md:max-w-[22rem] ${locations.length === 1 ? "md:max-w-[60%] lg:max-w-[40%]" : locations.length === 2 ? "md:max-w-[60%] lg:max-w-[60%]" : locations.length === 3 ? "lg:max-w-[80%]" : "lg:max-w-[100%]" }
      bg-gradient-to-br from-sky-200 to-blue-400
      shadow-md shadow-blue-300 
      rounded-xl 
    `}>
      {timezone.length > 0 && typeof utcOffset === "number" ? (
        <section className={`
          h-full ${locations.length === 3 ? "py-[0.6em]" : "py-[0.75em]"} lg:p-[0.9em]
          flex flex-col items-center ${locations.length === 4 ? "justify-between gap-[1.3em] lg:gap-[0.9em]" : locations.length === 3 ? "gap-[0.4em] lg:gap-[1em]" : "gap-[0.875em] lg:gap-[1.5em]"}
        `}>
          <Location
          utcOffset={utcOffset}
            searchKey={searchKey}
            locations={locations}
            setLocations={setLocations}
          />
          <AnalogClock
            now={now}
            isNow={isNow}
            refTimestamp={refTimestamp}
            timezone={timezone}
            locations={locations}
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
            locations={locations}
          />
        </section>
      ) : (
        <p>Loading timezone info...</p>
      )}
    </div>
  )
}

export default ClockCard