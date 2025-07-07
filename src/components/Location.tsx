import { useState, useEffect, useRef } from "react"
import { formatTimezoneString, capitaliseString } from "../utils"
import { SEARCH_KEYS } from "../data/citiesSearchKeys"
import { useTypeahead } from "../hooks/useTypeahead"

type Props = {
  utcOffset: number | null
  searchKey: string
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
}
const Location = ({ utcOffset, searchKey, setLocations }: Props) => {

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
        if (utcOffset !== null) {
            const [c, cn] = searchKey.split(", ")
            setCity(capitaliseString(c))
            setCountry(capitaliseString(cn))
        }
    }, [utcOffset, searchKey])

    // Focus the input on edit mode
    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    // reset focused dropdown to top when user is editing
    useEffect(() => {
        setHighlightedIndex(0)
    }, [query, editing])

 
    // Display mode
    if (!editing) {
        return (
            <div className="flex gap-2 text-xl">
                <span>{utcOffset !== null ? formatTimezoneString(utcOffset) : "..."}</span>
                <button
                    className="hover:cursor-pointer hover:underline"
                    onClick={() => setEditing(true)}
                    >
                    <span>{city}, {country}</span>
                </button>
            </div>
        )
    }

    // Edit mode (search input + dropdown)
    return (
        <div className="relative w-72">
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
                className="w-full rounded-lg border p-2"
            />
            {matches.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border bg-white shadow-lg">
                {matches.map((key, idx) => {
                    const [c, cn] = key.split(", ")
                    const isActive = idx === highlightedIndex
                    return (
                        <li
                            key={key}
                            className={`cursor-pointer px-3 py-2 ${isActive ? "bg-sky-200" : "hover:bg-sky-100"}`}
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
