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
    text-lg font-bold 
    px-5 py-2.5 text-center rounded-lg
    bg-sky-500 
    hover:bg-blue-500 
    focus:ring-4 focus:outline-none focus:ring-sky-600 
    transition-colors duration-300 ease-in-out
    cursor-pointer 
  `

  return (
    <main className="flex-1 overflow-y-auto w-full p-6 flex flex-col gap-4 border border-blue-900">
      <div className="btns-container w-full flex justify-between">
        <div className="add-minus-btns flex gap-2">
          <button
            className={`${buttonClass} w-14 ${locations.length > 3 && "disabled cursor-not-allowed"}`}        
            onClick={() => {
              setLocations(prev => [...prev, getRandomCity()])
            }}
          >
            +
          </button>
          <button
            className={`${buttonClass} w-14 ${locations.length < 3 && "disabled cursor-not-allowed"}`}
            onClick={() => {
              setLocations(prev => prev.slice(0, -1))
            }}
          >
            -
          </button>
          </div>
          <div className="control-btns w-3/5 flex justify-end gap-2">
            <button 
              className={`${buttonClass} w-28`}
              onClick={() => setIsNow(!isNow)}
            >
              {isNow ? "PAUSE" : "NOW"}
            </button>
            <button
              className={`${buttonClass} w-28 whitespace-nowrap`}
              onClick={() => setIs24h(!is24h)}
            >
              {is24h ? "AM / PM" : "24H"}
            </button>
        </div>
      </div>
      <div className="
          grid grow gap-6
          grid-cols-1
          sm:grid-cols-2
          auto-rows-fr
          w-full max-w-md sm:max-w-none mx-auto
      ">
        {locations.map((searchKey, idx)=> (
          <ClockCard 
            key={idx}
            now={now}
            isNow={isNow}
            setIsNow={setIsNow}
            is24h={is24h}
            refTimestamp={refTimestamp}
            setRefTimestamp={setRefTimestamp}
            setLocations={setLocations}
            searchKey={searchKey}
          />
        ))}
      </div>
    </main>
  )
}

export default Home