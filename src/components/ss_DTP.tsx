import { useState, useEffect, useMemo } from "react"

type Props = {
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  is24h: boolean

  /** stored in UTC (ms since epoch) */
  refTime: number
  setRefTime: React.Dispatch<React.SetStateAction<number>>

  /** convenience Date in UTC (will always equal new Date(refTime)) */
  refDate: Date
  setRefDate: React.Dispatch<React.SetStateAction<Date>>

  /** e.g. "Australia/Melbourne" */
  refTimezone: string
  setRefTimezone: React.Dispatch<React.SetStateAction<string>>

  /** this picker’s zone, same as refTimezone for you */
  timezone: string | null

  /** numeric offset ‑ e.g. 10 for UTC+10, ‑5 for UTC‑5 */
  utcOffset: number | null

  onDone: () => void
}

export default function DigitalTimePicker ({
  setIsNow,
  is24h,
  refTime,
  setRefTime,
  refDate,
  setRefDate,
  refTimezone,
  setRefTimezone,
  timezone,
  utcOffset,
  onDone
}: Props) {
  
  const local = useMemo(() => {
    if (!timezone || utcOffset == null) return new Date(refTime)
    return new Date(refTime + utcOffset * 3_600_000)
  }, [refTime, timezone, utcOffset])

  const init24h   = local.getHours()
  const initHour  = is24h
    ? init24h.toString().padStart(2, "0")
    : ((init24h % 12) || 12).toString().padStart(2, "0")
  const initMin   = local.getMinutes().toString().padStart(2, "0")
  const initPeriod: "AM" | "PM" = init24h >= 12 ? "PM" : "AM"

  const [hour,   setHour]   = useState(initHour)       // "00"‑"23" or "01"‑"12"
  const [minute, setMinute] = useState(initMin)        // "00"‑"59"
  const [period, setPeriod] = useState(initPeriod)

  /* ---------------------------------- */
  /* option builders                    */
  /* ---------------------------------- */
  const hourOptions = useMemo(() => {
    const len = is24h ? 24 : 12
    return Array.from({ length: len }, (_, i) => {
      const v = is24h
        ? i.toString().padStart(2, "0")
        : (i + 1).toString().padStart(2, "0")
      return <option key={v} value={v}>{v}</option>
    })
  }, [is24h])

  const minuteOptions = useMemo(() => (
    Array.from({ length: 60 }, (_, i) => {
      const v = i.toString().padStart(2, "0")
      return <option key={v} value={v}>{v}</option>
    })
  ), [])

  /* ---------------------------------- */
  /* push any change up to global state */
  /* ---------------------------------- */
  useEffect(() => {
    if (!timezone || utcOffset == null) return

    /* 1️⃣ to 24‑hour */
    let h24 = Number(hour)
    if (!is24h) {
      if (period === "PM" && h24 !== 12) h24 += 12
      if (period === "AM" && h24 === 12) h24  = 0
    }

    /* 2️⃣ construct wall clock date (UTC noon, then shift) */
    const today = new Date()
    const y = today.getUTCFullYear()
    const m = today.getUTCMonth()
    const d = today.getUTCDate()

    const wall = new Date(Date.UTC(y, m, d, h24, Number(minute)))
    const utcEpoch = wall.getTime() - utcOffset * 3_600_000
    const utcDate  = new Date(utcEpoch)

    setIsNow(false)
    setRefTime(utcEpoch)
    setRefDate(utcDate)
    setRefTimezone(timezone)
  }, [hour, minute, period, is24h, timezone, utcOffset,
      setIsNow, setRefTime, setRefDate, setRefTimezone])

  /* ---------------------------------- */
  /* UI                                 */
  /* ---------------------------------- */
  return (
    <div className="flex items-center gap-1">
      <div>
        <select
          className="appearance-none"
          value={hour}
          onChange={e => setHour(e.target.value)}
        >
          {hourOptions}
        </select>
        :
        <select
          className="appearance-none"
          value={minute}
          onChange={e => setMinute(e.target.value)}
        >
          {minuteOptions}
        </select>
      </div>

      {!is24h && (
        <select
          className="appearance-none px-1"
          value={period}
          onChange={e => setPeriod(e.target.value as "AM" | "PM")}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      )}

      {/* simple “done” control */}
      <button
        className="ml-2 rounded px-2 py-1 border"
        onClick={onDone}
      >
        ✓
      </button>
    </div>
  
  )
}
