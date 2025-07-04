import { useState, useEffect } from "react"
import ClockCard from "./ClockCard"

const MELBOURNE: [number, number] = [-37.8140, 144.9633]
const LONDON: [number, number] = [51.4500, 0.0500]

const Home = () => {
  const [isNow, setIsNow] = useState<boolean>(true)
  const [is24h, setIs24h] = useState<boolean>(false)
  const [manualTime, setManualTime] = useState<string>('00:00')
  const [locationStatus, setLocationStatus] = useState<string>('')
  const [refCoords, setRefCoords] = useState<[number, number] | null>(null)
  const [refTimezone, setRefTimezone] = useState<string>('Australia/Melbourne')
  const [locations, setLocations] = useState<Array<[number, number]>>([refCoords ?? MELBOURNE, LONDON])

  // Ask user for location permissions and if access is granted, update default timezone to be use user's coordinates
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {

      setLocationStatus(result.state)

      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setRefCoords([position.coords.latitude, position.coords.longitude])
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

  // when manual time changes, set it to the refCoords time
  useEffect(()=>{

  }, [manualTime, refCoords])

  const buttonClass = "w-24 h-12 p-2 bg-amber-200 rounded-xl cursor-pointer"

  return (
    <main className="grow w-full p-6 flex flex-col gap-4">
      <div className="w-full flex justify-end gap-10">
        <button 
          className={buttonClass}
          onClick={()=>{
            setIsNow(!isNow)
          }}  
        >
          {isNow ? "Pause" : "Now"}
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
      <div className="grow flex justify-center items-center gap-10">
        {locations.map((coords, idx)=> (
          <ClockCard 
            key={idx}
            isNow={isNow}
            setIsNow={setIsNow}
            is24h={is24h}
            manualTime={manualTime}
            setManualTime={setManualTime}
            coords={coords}
            setRefCoords={setRefCoords}
            locations={locations}
            setLocations={setLocations}  
          />
        ))}
      </div>
    </main>
  )
}

export default Home