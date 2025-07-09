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
    px-5 py-1.5 rounded-xl
    bg-sky-500 shadow-sm shadow-sky-600
    font-bold text-center tracking-wider
    cursor-pointer
    hover:bg-blue-500 
    focus:ring-2 focus:outline-none focus:ring-sky-600 
    transition-colors duration-300 ease-in-out
    disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500 
  `
  const MAX = 4
  const MIN = 2
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
        return "grid-cols-2"
      default:
        return "grid-cols-1"
  }
  })()

  const sm = ""
  const md = ""
  const lg = ""

  return (
    <main className="
      grow flex flex-col flex-1
      w-full max-w-screen-2xl mx-auto px-6 overflow-y-auto
    ">
      <div className="
        btns-container
        flex justify-between w-full 
        pt-3.5 pb-1.5 
        ">
        <div className="
          add-minus-btns
          flex gap-2 
          text-2xl 
        ">
          <button
            disabled={atMax}
            className={`${buttonClass} w-[2.3em]`}
            onClick={() => {
              if (atMax) return
              setLocations(prev => [...prev, getRandomCity()])
            }}
          >
            +
          </button>
          <button
            disabled={atMin}
            className={`${buttonClass} w-[2.3em]`}
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
            flex justify-end gap-2 t
            text-base 
          ">
            <button 
              className={`${buttonClass} w-[5.5em]`}
              onClick={() => setIsNow(!isNow)}
            >
              {isNow ? "PAUSE" : "NOW"}
            </button>
            <button
              className={`${buttonClass} w-[5.5em] whitespace-nowrap`}
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
            grid ${gridClass} auto-rows-max justify-items-center py-2 ${locations.length === 4 ? "gap-4 md:gap-10" : locations.length === 3 ? "gap-5 md:gap-16" : "gap-5 md:gap-30"}
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