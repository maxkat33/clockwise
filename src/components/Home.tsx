import { useState, useEffect } from "react"
import { getRandomCity, getClosestCityData } from "../utils"
import ClockCard from "./ClockCard"

const Home = () => {

  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [refTimestamp, setRefTimestamp] = useState<number>(Date.now())
  const [is24h, setIs24h] = useState<boolean>(false)
  
  // not passed as a prop - only needed here to render the correct amount and locations of clockcards
  const [locations, setLocations] = useState<string[]>(["melbourne, australia", "london, united kingdom"])
  // only used here to determine if the first clockcard is the users location or the default value
  const [locationStatus, setLocationStatus] = useState<string>('')

  // If now === true, update now's state every second so that it is accurate to the exact current time in this timezone
  useEffect(() => {
    if (!isNow) return
    const interval = setInterval(() => {
      setNow(Date.now())
      setRefTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(interval)

  }, [isNow])

  // Ask user for location permissions and if access is granted, update default timezone to be use user's coordinates
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {

      setLocationStatus(result.state)

      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCityData = getClosestCityData(position.coords.latitude, position.coords.longitude)
            console.log('userCityData: ', userCityData)
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

      // Listen for changes
      result.onchange = () => {
        setLocationStatus(result.state)
      }

    })
  }, [])

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
        {locations.map((cityCountry, idx)=> (
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
            cityCountry={cityCountry}
          />
        ))}
      </div>
    </main>
  )
}

export default Home