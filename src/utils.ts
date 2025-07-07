/******************************
  String Formatting Functions
******************************/

// Removes diacritics/accents from characters (e.g. "é" → "e")
export const normalizeStr = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const formatDigitalString = (timestamp: number): string => {
    
  let date = new Date(timestamp)
  let hours = date.getHours().toString().padStart(2, "0")
  let minutes = date.getMinutes().toString().padStart(2, "0")
  let seconds = date.getSeconds().toString().padStart(2, "0")

  return `${hours}:${minutes}:${seconds}`

}

export const capitaliseString = (string: string) => {
  return normalizeStr(string).split(' ').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')
}

export const formatTimezoneString = (utcOffset: number) => {

  let num = utcOffset

  let sign = "+"
  if (utcOffset < 0) {
    num = Math.abs(num)
    sign = "-"
  }

  let hours =  Math.floor(num).toString().padStart(2, "0")
  let minutes = Math.round((num % 1) * 60).toString().padStart(2, "0")

  return `UTC${sign}${hours}:${minutes}`
}

/**********************
  Location Functions
**********************/

import cityData from './data/citiesData.json'

type City = {
  city: string
  country: string
  timezone: string
  utcOffset: number
  lat: number
  lon: number
  searchKey: string
}

export const getCityData = (searchKey: string) : City | undefined => {
  const normalizedSearchKey = normalizeStr(searchKey).toLowerCase()
  return cityData.find((city) => normalizeStr(city.searchKey).toLowerCase() === normalizedSearchKey)
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Using Haversine Formula to calculate the distance between two sets of coordinates
    const toRad = (value: number) => value * Math.PI / 180
  
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

export const getClosestCityData = (lat: number, lon: number): City => {

  let closest = cityData[0]
  let minDistance = getDistance(lat, lon, closest.lat, closest.lon)

  for (const city of cityData) {
    const dist = getDistance(lat, lon, city.lat, city.lon)
    if (dist < minDistance) {
      // If coords within 10km of city return 
      if (dist < 10) {
        return city
      }
      minDistance = dist
      closest = city
    }
  }

  return closest
}

export const getRandomCity = () => {
  const randomNum = Math.floor(Math.random() * cityData.length)
  return cityData[randomNum].searchKey
}

/****************************
  Time Converting Functions
****************************/

export const formatUtcTimestampToDate = (timestamp: number, timezone: string, is24h: boolean = true): string => {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,               
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24h,
  }).format(new Date(timestamp))
}

export const getCityDateFromUTC = (timestamp: number, timezone: string): Date => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  })

  const parts = formatter.formatToParts(new Date(timestamp))
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? "0")

  const date = new Date(Date.UTC(1970, 0, 1, get("hour"), get("minute"), get("second")))
  return date
}

