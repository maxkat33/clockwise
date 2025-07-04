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

    const displayTime = '00:00:00'

    useEffect(() => {
        if (isNow) {
            // format now to digital display
            displayTime = now
        }
        else {
            // format manual time to digital display
            displayTime = manualTime
        }
    }, [isNow])

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