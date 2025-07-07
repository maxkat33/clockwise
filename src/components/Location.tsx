import { useState, useEffect } from "react"

import { formatTimezoneString, capitaliseString } from "../utils"

type Props = {
    utcOffset: number | null
    searchKey: string
    locations: string[]
    setLocations: React.Dispatch<React.SetStateAction<string[]>>
}

const Location = ({ utcOffset, searchKey, locations, setLocations }: Props) => {

    //function that has input drop down of cities and updates locations with city of new location
    
    const [city, setCity] = useState<string | null>(null)
    const [country, setCountry] = useState<string | null>(null)
    const [timezone, setTimezone] = useState<string | null>(null)

    useEffect(() => {

        if (utcOffset!== null && utcOffset !== undefined) {
            setTimezone(formatTimezoneString(utcOffset))
            const [city, country] = searchKey.split(', ')
            setCity(capitaliseString(city))
            setCountry(capitaliseString(country))
        }

    }, [utcOffset, searchKey])


    return (
    <div className="flex gap-2 text-xl">
        <p>{timezone}</p>
        <p>{city}, {country}</p>
    </div>
    )
}

export default Location