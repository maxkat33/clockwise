import { useState, useEffect } from "react"
import { getRandomCity, getClosestCityData } from "../utils"
import ClockCard from "./ClockCard"

const Home = () => {
  
  // state
  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [refTimestamp, setRefTimestamp] = useState<number>(Date.now())
  const [is24h, setIs24h] = useState<boolean>(false)
  const [locations, setLocations] = useState<string[]>(["melbourne, australia", "london, united kingdom"])
  const [locationStatus, setLocationStatus] = useState<string>('')

  // useEffects

  // If now === true, update now in state every second to Unix time
  useEffect(() => {
    if (!isNow) return
    const interval = setInterval(() => {
      setNow(Date.now())
      setRefTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(interval)

  }, [isNow])

  // Ask user for location permissions and if access is granted, update first clock to be in the user's city
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {
      setLocationStatus(result.state)
      
      // Listen for changes
      result.onchange = () => {
        setLocationStatus(result.state)
      }
    })
  }, [])

  useEffect(() => {
    if (locationStatus === 'granted' || locationStatus === 'prompt') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCityData = getClosestCityData(position.coords.latitude, position.coords.longitude)
          const userCity = userCityData.searchKey
          setLocations((prevLocations) => {
            const newLocations = [...prevLocations]
            newLocations[0] = userCity       
            return newLocations 
          })
        },
        (error) => {
          console.error(`Geolocation error ${error.code}: ${error.message}`)
        }
      )
    }
  }, [locationStatus])

  // Tailwind classes

  const buttonClass = `
    flex justify-center items-center
    px-[0.3em] pb-[0.2em] py-[0.15em] md:py-[0.25em] rounded-xl
    bg-blue-400 shadow-sm shadow-blue-600
    font-bold text-center tracking-wider
    cursor-pointer
    hover:bg-blue-500 
    focus:ring-2 focus:outline-none focus:ring-blue-500 
    transition-colors duration-300 ease-in-out
    disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500 
  `
  const MAX = 4
  const MIN = 1
  const atMax = locations.length >= MAX
  const atMin = locations.length <= MIN

  const gridClass = (() => {
    switch (locations.length) {
      case 1:
        return "grid-cols-1 lg:grid-cols-1"
      case 2:
        return "grid-cols-1 lg:grid-cols-2"
      case 3:
        return "grid-cols-1 lg:grid-cols-3"
      case 4:
        return "grid-cols-2 lg:grid-cols-4"
      default:
        return "grid-cols-1"
  }
  })()

  return (
    <main className="
      grow flex flex-col flex-1
      w-full px-[1.5em] overflow-y-auto
    ">
      <div className="
        btns-container
        flex justify-between w-full 
        pb-[0.6em] pt-[0.8em] md:pt-[1em] lg:pt-[1.2em]
        ">
        <div className="
          add-minus-btns
          flex gap-[0.7em] md:gap-[0.8em]
          text-[1.3rem] md:text-[2rem]
        ">
          <button
            disabled={atMax}
            className={`${buttonClass} w-[2.3em] md:w-[3em]`}
            onClick={() => {
              if (atMax) return
              setLocations(prev => [...prev, getRandomCity()])
            }}
          >
            +
          </button>
          <button
            disabled={atMin}
            className={`${buttonClass} w-[2.3em] md:w-[3em]`}
            onClick={() => {
              if (atMin) return
              setLocations((prev => prev.slice(0, -1)))
            }}
          >
            -
          </button>
          </div>
          <div className="
            control-btns
            w-3/5 
            flex justify-end gap-[1em] md:gap-[1.2em] lg:gap-[1.5em]
            text-[0.9rem] md:text-[1.25rem] lg:text-[1.4rem]
          ">
            <button 
              className={`${buttonClass} w-[5em] md:w-[7em]`}
              onClick={() => setIsNow(!isNow)}
            >
              {isNow ? "PAUSE" : "NOW"}
            </button>
            <button
              className={`${buttonClass} w-[5em] md:w-[7em] whitespace-nowrap`}
              onClick={() => setIs24h(!is24h)}
            >
              {is24h ? "AM / PM" : "24H"}
            </button>
        </div>
      </div>
      <div className="grow flex items-center">
        <div className={`
          clockCardsContainer
          w-full
          grid ${gridClass} auto-rows-max justify-items-center py-[0.5em] ${locations.length === 4 ? "" : "lg:px-[2em]" } ${locations.length === 4 ? "gap-[1em] md:gap-[2.5em] lg:gap-[1.8em] lg:pb-[1.4em]" : locations.length === 3 ? "gap-[1.25em] md:gap-[1em] lg:gap-[4em]" : "gap-[1.2em] md:gap-[2em]"}
        `}>
          {locations.map((searchKey, idx)=> (
            <ClockCard 
            key={idx}
            now={now}
            isNow={isNow}
            setIsNow={setIsNow}
            is24h={is24h}
            refTimestamp={refTimestamp}
            setRefTimestamp={setRefTimestamp}
            locations={locations}
            setLocations={setLocations}
            searchKey={searchKey}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home