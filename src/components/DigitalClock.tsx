import { useState, useEffect } from "react"
import { formatUtcTimestampToDate } from "../utils.ts"

type Props = {
    now: number
    isNow: boolean
    setIsNow: React.Dispatch<React.SetStateAction<boolean>>
    is24h: boolean
    refTimestamp: number
    setRefTimestamp: React.Dispatch<React.SetStateAction<number>>
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
    timezone,
    utcOffset
}: Props) => {

    // state

    const [displayHours, setDisplayHours] = useState<string>("")
    const [displayMinutes, setDisplayMinutes] = useState<string>("")
    const [displaySeconds, setDisplaySeconds] = useState<string>("")
    const [displayAmPm, setDisplayAmPm] = useState<string>("")
    
    // handlers

    const updateRefTime = () => {
        if (!isNow && utcOffset) {

            const manualDate      = new Date()
            const year     = manualDate.getUTCFullYear()
            const month    = manualDate.getUTCMonth()
            const day      = manualDate.getUTCDate()
            const h        = Number(displayHours)
            let h24        = h
            if (displayAmPm === "PM" && h !== 12) h24 = h + 12
            if (displayAmPm === "AM" && h === 12) h24 = 0

            const utcOffsetMs = utcOffset * 60 * 60 * 1000

            const rawUtcDate = new Date(Date.UTC(year, month, day, h24, Number(displayMinutes), Number(displaySeconds)))
            const convertedUtcTimestamp = rawUtcDate.getTime() - utcOffsetMs

            setRefTimestamp(convertedUtcTimestamp)            
        }
    }

    // useEffects

    useEffect(() => {
        if (!timezone) return 
        const timestamp = isNow ? now : refTimestamp
        const displayTime = formatUtcTimestampToDate(timestamp, timezone, is24h).toUpperCase()
        setDisplayHours(displayTime.slice(0, 2))
        setDisplayMinutes(displayTime.slice(3,5))
        setDisplaySeconds(displayTime.slice(6,8))
        setDisplayAmPm(displayTime.slice(9,11))
        
    }, [now, isNow, is24h, refTimestamp])

    useEffect(() => {
        if (!isNow && displayHours && displayMinutes && displaySeconds && (is24h || displayAmPm)) {
          updateRefTime()
        }
      }, [displayHours, displayMinutes, displaySeconds, displayAmPm])
    

    // element creating logic

    const hoursOptions = []
    const hoursOptions24 = []
    const minutesOptions = []
    const secondsOptions = []

    for (let i = 0; i < 12; i++) {
        const hour = (i + 1).toString().padStart(2, '0')
        hoursOptions.push(
         <option key={hour} value={hour}>
             {hour}
         </option>
        )
     }

    for (let i = 0; i < 24; i++) {
        const hour = (i).toString().padStart(2, '0')
        hoursOptions24.push(
         <option key={hour} value={hour}>
             {hour}
         </option>
        )
    }
 
    for (let i = 0; i < 60; i++) {
        const minute = (i).toString().padStart(2, '0')
        const second = (i).toString().padStart(2, '0')
        minutesOptions.push(
        <option key={minute} value={minute}>
            {minute}
        </option>
        )
        secondsOptions.push(
            <option key={second} value={second}>
                {second}
            </option>
        )
    }

    return (
    <div 
        className="
            relative flex justify-center items-center
            text-2xl tracking-wider
            cursor-pointer"
        onClick={() => setIsNow(false)}
    >
        <span className="inline-flex space-x-1 tracking-wide">
            <select 
                value={displayHours}
                className="appearance-none cursor-pointer"
                onChange={(e) => {
                    setIsNow(false)
                    setDisplayHours(e.target.value)
                }}
                >
                {is24h ? hoursOptions24 : hoursOptions}
            </select>
            :
            <select 
                value={displayMinutes}
                className="appearance-none cursor-pointer"
                onChange={(e) => {
                    setIsNow(false)
                    setDisplayMinutes(e.target.value)
                }}
                >
                {minutesOptions}
            </select>
            :
            <select 
                value={displaySeconds}
                className="appearance-none cursor-pointer"
                onChange={(e) => {
                    setIsNow(false)
                    setDisplaySeconds(e.target.value)
                }}
                >
                {secondsOptions}
            </select>
        </span>
        {!is24h && (
            <select 
            value={displayAmPm}
            className="
                absolute left-full
                px-2
                appearance-none cursor-pointer"
            onChange={(e) => {
                setIsNow(false)
                    setDisplayAmPm(e.target.value)
                }}
            >
                <option>AM</option>
                <option>PM</option>
            </select>
        )}
    </div>

        
    )
}

export default DigitalClock