import { useState, useEffect, useRef } from "react"
import { formatTimezoneString, capitaliseString } from "../utils"
import { SEARCH_KEYS } from "../data/citiesSearchKeys"
import { useTypeahead } from "../hooks/useTypeahead"

type Props = {
    idx: number 
    searchKey: string
    locations: string[]
    setLocations: React.Dispatch<React.SetStateAction<string[]>>
    utcOffset: number | null
}

const sizeMap: Record<number, string> = {
    1: "text-[1.5rem] md:text-[2.2rem]/12 xl:text-[2.9rem]/18",
    2: "text-[1.4rem]/8 md:text-[1.75rem]/9 lg:text-[2.2rem]/12 xl:text-[2.7rem]/16",
    3: "text-[1.15rem]/6 md:text-[1.45rem]/7 lg:text-[1.7rem]/10 xl:text-[2.2rem]/14",
    4: "text-[1rem]/7 md:text-[1.55rem]/9 lg:text-[1.6rem]/10 xl:text-[1.9rem]/12"
} 

const utcSizeMap: Record<number, string> = {
    1: "text-[1.4rem] md:text-[1.9rem] lg:text-[2rem] xl:text-[2.2rem]",
    2: "text-[1.25rem] md:text-[1.45rem] lg:text-[1.9rem] xl:text-[2rem]",
    3: "text-[1rem] md:text-[1.15rem] lg:text-[1.65rem] xl:text-[1.8rem]",
    4: "text-[0.85rem] md:text-[1.3rem] lg:text-[1.4rem] xl:text-[1.6rem]"
}

const Location = ({ idx, utcOffset, searchKey, locations, setLocations }: Props) => {

    // state
    const [city, setCity] = useState<string | null>(null)
    const [country, setCountry] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [query, setQuery] = useState("")
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // helper logic 
    const matches = useTypeahead(SEARCH_KEYS, query)

    const chooseSearchKey = (key: string) => {
        setLocations((prev) => {
            const updated = [...prev]
            updated[idx] = key
            return updated
        })
        setEditing(false)
        setQuery("")
    }

    // useEffects
    // Split city and country for display
    useEffect(() => {
            const [c, cn] = searchKey.split(", ")
            setCity(capitaliseString(c))
            setCountry(capitaliseString(cn))
    }, [searchKey])

    // Focus the input on edit mode
    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    // reset focused dropdown to top when user is editing
    useEffect(() => {
        setHighlightedIndex(0)
    }, [query, editing])

    // Tailwind classes
    const count = Math.min(locations.length, 8)
    const textSize = sizeMap[count] || sizeMap[8]
    const utcTextSize = utcSizeMap[count] || sizeMap[8]

    // Display mode
    if (!editing) {
        return (
            <div className={`
                relative
                flex flex-col justify-center items-center
                tracking-wide
            `}>
                <button
                    onClick={() => setEditing(true)}
                    className={`font-[600] ${textSize} w-full px-[0.8em] rounded-xl block truncate overflow-hidden text-ellipsis hover:cursor-pointer hover:scale-[1.05] hover:bg-white/20 transition-all duration-400 ease-in-out`}
                    >
                    {city}, {country}
                </button>
                <span className={`font-[500] ${utcTextSize}`}>
                    {utcOffset !== null ? formatTimezoneString(utcOffset) : "..."}
                </span>
            </div>
        )
    }

    // Edit mode (search input + dropdown)
    return (
        <div className="relative w-full bg-slate-200">
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Enter" && matches.length === 0) {
                        setEditing(false)
                        setQuery("")
                    }
                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setHighlightedIndex((prev) =>
                        prev < matches.length - 1 ? prev + 1 : 0
                        )
                    }
                    if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setHighlightedIndex((prev) =>
                            prev > 0 ? prev - 1 : matches.length - 1
                        )
                    }
                    if (e.key === "Enter" && matches.length > 0) {
                        e.preventDefault()
                        chooseSearchKey(matches[highlightedIndex])
                    }
                }}
                onBlur={() => {
                    setTimeout(() => {
                        setEditing(false)
                        setQuery("")
                    }, 100)
                }}
                placeholder="Search for a city..."
                className="w-full p-2 border rounded-lg"
            />
            {matches.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-60">
                {matches.map((key, idx) => {
                    const [c, cn] = key.split(", ")
                    const isActive = idx === highlightedIndex
                    return (
                        <li
                            key={key}
                            className={`cursor-pointer px-3 py-2 ${isActive ? "bg-pink-200" : "hover:bg-purple-100"}`}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onClick={() => chooseSearchKey(key)}
                        >
                            {capitaliseString(c)}, {capitaliseString(cn)}
                        </li>
                    )
                })}
            </ul>
            )}
        </div>
    )

}

export default Location
