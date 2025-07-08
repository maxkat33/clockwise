import { useState, useEffect, useRef } from "react"
import { formatTimezoneString, capitaliseString } from "../utils"
import { SEARCH_KEYS } from "../data/citiesSearchKeys"
import { useTypeahead } from "../hooks/useTypeahead"

type Props = {
  searchKey: string
  locations: string[]
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
}

const Location = ({ searchKey, locations, setLocations }: Props) => {

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
            const idx = prev.indexOf(searchKey)
            if (idx !== -1) {
                updated[idx] = key
            }
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

    const textClamp = "text-[clamp(1rem,4.8vw,2rem)]"

 
    // Display mode
    if (!editing) {
        return (
            <div className={`
                flex justify-center
                w-full 
                font-[600] text-[1.4rem] tracking-wide
            `}>
                <button
                    onClick={() => setEditing(true)}
                    className={`${locations.length === 4 ? "whitespace-normal break-words" : "block truncate overflow-hidden text-ellipsis"} hover:cursor-pointer hover:underline`}
                >
                    {city}, {country}
                </button>
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
