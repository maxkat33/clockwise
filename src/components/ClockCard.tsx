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
  cityCountry: string
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
  cityCountry
}: Props) => {
  
  // each clockcard tracks now itself to avoid re rendering the entire app every second - only the clockcard itself
  const [utcOffset, setUtcOffset] = useState<number | null>(null)
  const [timezone, setTimezone] = useState<string>("")
  

  useEffect(() => {
    const cityData = getCityData(cityCountry)
    // console.log('cityData:', cityData)
    if (cityData) {
      setUtcOffset(cityData.utcOffset)
      setTimezone(cityData.timezone)
    }
  }
  , [cityCountry])
  
  // function that converts ref time to ref time formatted to timezone


  // function to determine timezone from coords

  return (
    <div className="flex flex-col gap-2 p-3 bg-sky-100">
      {timezone && utcOffset !== null ? (
      <>
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
          cityCountry={cityCountry}
          locations={locations}
          setLocations={setLocations}
        />
      </>
      ) : (
        <p>Loading timezone info...</p>
      )}
    </div>
  )
}

export default ClockCard