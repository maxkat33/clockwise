import { useState, useEffect } from "react"
import { IoIosClose } from "react-icons/io"
import { IoHomeOutline } from "react-icons/io5"
import { FaSpinner } from "react-icons/fa"


import { getCityData, getClosestCityData } from "../utils"

import AnalogClock from "./AnalogClock"
import DigitalClock from "./DigitalClock"
import Location from "./Location"

type Props = {
  idx: number
  now: number
  isNow: boolean
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  is24h: boolean
  refTimestamp: number
  setRefTimestamp: React.Dispatch<React.SetStateAction<number>>
  locations: string[]
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
  locationGranted: boolean
  searchKey: string
}

const ClockCard = ({
  idx,
  now,
  isNow,
  setIsNow,
  is24h,
  refTimestamp,
  setRefTimestamp,
  locations,
  setLocations,
  locationGranted,
  searchKey
}: Props) => {

  console.log(`clockCard rendered for ${searchKey} - location granted === ${locationGranted}`)

  // state
  
  const [utcOffset, setUtcOffset] = useState<number | null>(null)
  const [timezone, setTimezone] = useState<string>("")
  const [loadingLocation, setLoadingLocation] = useState(false)

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
      relative w-full max-w-sm sm:max-w-md md:max-w-[22rem] 
      ${locations.length === 1 ? "md:max-w-[70%] lg:max-w-[60%] xl:max-w-[30%]" : locations.length === 2 ? "md:max-w-[60%] lg:max-w-[100%] xl:max-w-[60%]" : locations.length === 3 ? "lg:max-w-[100%] xl:max-w-[80%]" : "lg:max-w-[90%]" }
      bg-gradient-to-br from-sky-200 to-blue-400 rounded-xl shadow-md shadow-blue-300 
    `}>
      <div 
        className={`
          closeIcon
          absolute z-100 right-[0.05em] 
          text-[2rem] md:text-[2em] opacity-20 text-black ${locations.length === 1 ? "cursor-not-allowed": "cursor-pointer"}  
          hover:scale-[1.1] hover:text-red-700 hover:opacity-100 transition-all duration-500 ease-in-out
        `}
        onClick={()=> {
          if (locations.length !== 1) setLocations((prev)=>{
            const updated = [...prev]
            updated.splice(idx, 1)
            return updated
          })
        }}
        >
        <IoIosClose />
      </div>
      { locationGranted && (
        <div 
        className={`
          homeIcon
          absolute z-100 p-[0.3em]
          text-[1em] md:text-[1.2em] opacity-20 text-black cursor-pointer 
          hover:scale-[1.1] hover:text-blue-900 hover:opacity-100 transition-all duration-500 ease-in-out
        `}
        onClick={() => {
          setLoadingLocation(true)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCityData = getClosestCityData(position.coords.latitude, position.coords.longitude)
              const userCity = userCityData.searchKey
              setLocations((prev) => {
                const updated = [...prev]
                updated[idx] = userCity
                return updated
              })
              setLoadingLocation(false)
            },
            (error) => {
              console.error("Failed to get location on Home icon click", error)
              setLoadingLocation(false)
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000,
            }
          )
        }}
        >
          {loadingLocation ? (
            <FaSpinner className="animate-spin text-blue-900 h-5 w-5" />
          ) : (
            <IoHomeOutline />
          )}
        </div> 
      )}
      {timezone.length > 0 && typeof utcOffset === "number" ? (
        <section className={`
          h-full ${locations.length === 3 ? "py-[0.6em]" : "py-[0.75em]"} md:p-[1em] lg:py-[0.9em] lg:px-[0.5em] 
          flex flex-col items-center ${locations.length === 4 ? "justify-between gap-[1.3em] lg:gap-[1.4em]" : locations.length === 3 ? "gap-[0.4em] md:gap-[0.6em] lg:gap-[1em]" : "gap-[0.875em] lg:gap-[1.3em]"}
        `}>
          <Location
            idx={idx}
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