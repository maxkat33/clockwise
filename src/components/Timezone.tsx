type Props = {
    timezone: string
    cityCountry: string
    locations: Array<[number, number]>
    setLocations: React.Dispatch<React.SetStateAction<Array<[number, number]>>>
}

const Timezone = ({ timezone, cityCountry, locations, setLocations }: Props) => {

    //function that has input drop down of cities and updates locations with coords of new location

    return (
    <div className="flex gap-4 text-xl">
        <p>{timezone}</p>
        <p>{cityCountry}</p>
    </div>
    )
}

export default Timezone