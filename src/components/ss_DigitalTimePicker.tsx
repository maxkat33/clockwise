import { useState, useEffect } from "react"
import { formatUtcTimestampToDate } from "../utils"

type Props = {
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

const DigitalTimePicker = ({
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

    
    const [hours,   setHours]   = useState(()=> formatUtcTimestampToDate(refTimestamp, timezone, is24h).slice(0,2))
    // console.log(formatUtcTimestampToDate(refTimestamp, timezone, is24h))
    // console.log(hours, timezone)
    const [minutes, setMinutes] = useState(()=> formatUtcTimestampToDate(refTimestamp, timezone, is24h).slice(3,5))
    const [period, setPeriod] = useState<"AM" | "PM">("AM")
    
    useEffect(()=>{
        if (!timezone) return 
        const renderDate = formatUtcTimestampToDate(refTimestamp, timezone, is24h)
        const renderHours = renderDate.slice(0,2)
        const renderMinutes = renderDate.slice(3,5)
        setHours(renderHours)
        setMinutes(renderMinutes)
        // setHour(renderDate.getHours())
    }, [])

    useEffect(()=> {
        if (!timezone || !utcOffset) return

        const manualDate      = new Date()
        const year     = manualDate.getUTCFullYear()
        // console.log('y', year)
        const month    = manualDate.getUTCMonth()
        // console.log('m', month)
        const day      = manualDate.getUTCDate()
        // console.log('d', day)
        const h        = Number(hours)
        // console.log('h', h)
        let h24        = h
        if (period === "PM" && h !== 12) h24 = h + 12
        if (period === "AM" && h === 12) h24 = 0
        // console.log('h24', h24)

        const utcOffsetMs = utcOffset * 60 * 60 * 1000

        const rawUtcDate = new Date(Date.UTC(year, month, day, h24, Number(minutes)))
        const convertedUtcTimestamp = rawUtcDate.getTime() - utcOffsetMs
        const convertedUtcDate = new Date(convertedUtcTimestamp)

        setRefDate(convertedUtcDate)
        setRefTimestamp(convertedUtcTimestamp)
        setRefTimezone(timezone)

    }, [hours, minutes, period, timezone])

    const hourOptions = []
    const minuteOptions = []

    for (let i = 0; i < 12; i++) {
       const hour = (i + 1).toString().padStart(2, '0')
       hourOptions.push(
        <option key={hour} value={hour}>
            {hour}
        </option>
       )
    }

    for (let i = 0; i < 60; i++) {
        const minute = (i).toString().padStart(2, '0')
        minuteOptions.push(
         <option key={minute} value={minute}>
             {minute}
         </option>
        )
     }

    return (
        <div className="flex justify-between cursor-pointer">
            <div>
                <select 
                    className="appearance-none cursor-pointer"
                    value={hours}
                    onChange={(e) => {
                        setIsNow(false)
                        setHours(e.target.value)}
                    }
                    onBlur={()=>{console.log('blur')}}
                >
                    {hourOptions}
                </select>
                :
                <select 
                    className="appearance-none cursor-pointer"
                    value={minutes}
                    onChange={(e) => {
                        setIsNow(false)
                        setMinutes(e.target.value)}
                    }
                >
                    {minuteOptions}
                </select>
            </div>
            <select 
                className="appearance-none cursor-pointer px-2"
                value={period}
                onChange={(e) => {
                    setIsNow(false)
                    setPeriod(e.target.value as "AM" | "PM")}
                }
            >
                <option value={'AM'}>
                    AM
                </option>
                <option value={'PM'}>
                    PM
                </option>
            </select>             
        </div>
    )
}

export default DigitalTimePicker