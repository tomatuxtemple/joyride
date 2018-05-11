import Dublin from './Dublin.json'
import getDistance from './get-distance.js'

const mapCity = city => station => ({
  city,
  id: `${city}-${station.name}`,
  latitude: station.latitude,
  longitude: station.longitude,
  number: station.number,
  freeBikes: '-',
  emptySpaces: '-',
})

const cities = [...Dublin.map(mapCity('Dublin'))]

const byDistance = (a, b) => a.distance - b.distance

export const getNearBy = coords => {
  return cities
    .map(station => {
      return {
        ...station,
        // TODO maybe meters?
        distance: getDistance(coords, station) / 1000,
      }
    })
    .sort(byDistance)
}

export const getLiveInfo = async list => {
  const data = await getStationsData(list[0].city)
  return list.map(station => ({
    ...station,
    ...getFreeBikesAndEmptySpaces(
      data.find(item => item.number === station.number)
    ),
  }))
}

const getFreeBikesAndEmptySpaces = ({
  available_bikes,
  available_bike_stands,
}) => ({
  freeBikes: available_bikes,
  emptySpaces: available_bike_stands,
})

// TODO extract
const API_KEY = '0efa5773562a42988763227e832bd924b76469e6'

const getStationsData = async city => {
  const res = await fetch(
    `https://api.jcdecaux.com/vls/v1/stations?contract=${city}&apiKey=${API_KEY}`
  )
  return await res.json()
}
