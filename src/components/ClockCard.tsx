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

  const sm = "sm:max-w-md"
  const md = "md:max-w-[22rem]"
  const lg = "lg:max-w-[24rem]"

  return (
    <div className={`
      clockCard
      ${sm} ${md} ${lg}
      w-full max-w-sm
      bg-gradient-to-br from-sky-200 to-blue-400
      shadow-md shadow-blue-300 
      rounded-xl 
    `}>
      {timezone.length > 0 && typeof utcOffset === "number" ? (
        <section className={`
          h-full ${locations.length === 3 ? "py-2.5" : "py-3" }
          flex flex-col items-center ${locations.length === 4 ? "justify-between gap-2" : "gap-3.5" }
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