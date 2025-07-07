import { useState, useEffect } from "react"
import DigitialTimePicker from './ss_DigitalTimePicker.tsx'
import { formatUtcTimestampToDate } from "../utils.ts"

type Props = {
    now: number
    isNow: boolean
    setIsNow: React.Dispatch<React.SetStateAction<boolean>>
    is24h: boolean

    refTimestamp: number
    setRefTimestamp: React.Dispatch<React.SetStateAction<number>>

    refDate: Date
    setRefDate: React.Dispatch<React.SetStateAction<Date>>

    refTimezone: string
    setRefTimezone: React.Dispatch<React.SetStateAction<string>>

    timezone: string
    utcOffset: number | null
}

const DigitalClock = ({
    now,
    isNow,
    setIsNow,
    is24h,
    refTimestamp,
    setRefTimestamp,
    refDate,
    setRefDate,
    refTimezone,
    setRefTimezone,
    timezone,
    utcOffset
}: Props) => {

    const [display, setDisplay] = useState<string>("")
    

    useEffect(() => {
        if (!timezone) return 
        const timestamp = isNow ? now : refTimestamp
        setDisplay(formatUtcTimestampToDate(timestamp, timezone, is24h).toUpperCase())
    }, [now, isNow, is24h])

    return (
    <div 
        className="self-center text-2xl tracking-wider"
        onClick={()=>{ 
            setIsNow(false)
        }}
    >
            <DigitialTimePicker 
                setIsNow={setIsNow}
                is24h={is24h}
                refTimestamp={refTimestamp}
                setRefTimestamp={setRefTimestamp}
                refDate={refDate}
                setRefDate={setRefDate}
                refTimezone={refTimezone}
                setRefTimezone={setRefTimezone}
                timezone={timezone}
                utcOffset={utcOffset}
            />
            {/* <p className="cursor-pointer">
                {display ? display : 'Loading...'}
            </p> */}
    </div>

        
    )
}

export default DigitalClock