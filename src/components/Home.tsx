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

  const buttonClass = "w-24 h-12 p-2 bg-amber-200 rounded-xl tracking-wide font-bold cursor-pointer flex justify-center items-center"

  return (
    <main className="grow w-full p-6 flex flex-col gap-4">
      <div className="w-full flex justify-between">
        <div className="flex gap-4 text-3xl">
          <button 
              className={buttonClass}
              onClick={()=>{
                setLocations((prev)=> {
                  const randomCity = getRandomCity()
                  return [...prev, randomCity]
                })
                getRandomCity()
              }}  
            >
              +
            </button>
            <button 
              className={buttonClass}
              onClick={()=>{
                if (!(locations.length > 2)) return
                setLocations((prev)=> {
                  const locs = [...prev]
                  locs.pop()
                  return locs
                })
                getRandomCity()
              }}
            >
              -
            </button>
          </div>
          <div className="flex gap-4">
            <button 
              className={buttonClass}
              onClick={()=>{
                setIsNow(!isNow)
              }}  
            >
              {isNow ? "PAUSE" : "NOW"}
            </button>
            <button 
              className={buttonClass} 
              onClick={()=>{
                setIs24h(!is24h)
              }}
            >
              {is24h ? "AM / PM" : "24H"}
            </button>
        </div>
      </div>
      <div className="grow flex justify-center items-center gap-10">
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