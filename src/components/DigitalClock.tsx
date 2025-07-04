import { useEffect } from "react"

type Props = {
    now: number
    isNow: boolean
    setIsNow: React.Dispatch<React.SetStateAction<boolean>>
    is24h: boolean
    manualTime: string
    setManualTime: React.Dispatch<React.SetStateAction<string>>
    coords: [number, number]
    setRefCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>
    timezone: string
}

const DigitalClock = ({
    now,
    isNow,
    setIsNow,
    is24h,
    manualTime,
    setManualTime,
    coords,
    setRefCoords,
    timezone
}: Props) => {

    console.log(now)
    
    let displayTime = '00:00:00'
    let hours = "00"
    let minutes = "00"
    let seconds = "00"

    useEffect(() => {
        if (isNow) {
            // format now to digital display
            hours = new Date(Date.now()).getHours().toString()
            minutes = new Date(Date.now()).getMinutes().toString()
            seconds = new Date(Date.now()).getSeconds().toString()

            displayTime = `${hours}:${minutes}:${seconds}`
        }
        else {
            // format manual time to digital display
            displayTime = manualTime
        }
    }, [now, isNow])

    useEffect(() => {
        if (is24h) {
            // format displayTime to 24h
        }
        else {
            // format displayTime to AM / PM
        }
    }, [is24h])

    // onChange()=>{
    // setIsNow === false
    // setRefCoords to coords
    // setManualTime to selected time
    // }


    return (
    <p className="self-center text-2xl tracking-wider">{displayTime}</p>
    )
}

export default DigitalClock