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
  
  // Tailwind classes
  

  return (
    <div className={`
      clockCard
      py-4 ${locations.length === 4 ? "px-3" : "px-4"}
      bg-sky-200 rounded-xl 
      shadow-md shadow-sky-300 
      hover:shadow-lg hover:shadow-blue-300 
      focus:shadow-lg focus:shadow-blue-300
      transition-shadow duration-300 ease-in-out 
    `}>
      {timezone.length > 0 && typeof utcOffset === "number" ? (
      <section className={`
        h-full 
        flex flex-col justify-start items-center gap-${locations.length === 3 ? "1" : "2"}
      `}>
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
        <Location
          utcOffset={utcOffset}
          searchKey={searchKey}
          locations={locations}
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