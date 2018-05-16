import * as cities from './cities.js'
import geolib from 'geolib'

const sortAlphabetically = (a, b) => (a < b ? -1 : a === b ? 0 : 1)
const byAddress = (a, b) => sortAlphabetically(a.address, b.address)
const byDistance = (a, b) => a.distance - b.distance
const byName = (a, b) => sortAlphabetically(a.name, b.name)

export const list = cities.list

export const findMyCity = coords => {
  const found = list.find(city =>
    geolib.isPointInside(coords, cities.byId[city.id].area)
  )
  return found ? found.id : null
}

export const getStations = (city, coords) =>
  !coords
    ? cities.byId[city].stations.sort(byAddress)
    : cities.byId[city].stations
        .map(station => {
          return {
            ...station,
            distance: geolib.getDistance(coords, station),
          }
        })
        .sort(byDistance)

export const getLiveInfo = async (city, list) => {
  const data = await getStationsData(city)
  return list.map(station => ({
    ...station,
    ...getFreeBikesEmptySpacesAndIsOpen(
      data.find(item => item.number === station.number)
    ),
  }))
}

const getFreeBikesEmptySpacesAndIsOpen = ({
  available_bikes,
  available_bike_stands,
  status,
}) => ({
  freeBikes: available_bikes,
  emptySpaces: available_bike_stands,
  isClosed: status === 'CLOSED',
})

// TODO extract
const API_KEY = '0efa5773562a42988763227e832bd924b76469e6'

const getStationsData = async city => {
  const res = await fetch(
    `https://api.jcdecaux.com/vls/v1/stations?contract=${city}&apiKey=${API_KEY}`
  )
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export const getCities = async () => {
  const res = await fetch(
    `https://api.jcdecaux.com/vls/v1/contracts?apiKey=${API_KEY}`
  )
  const data = await res.json()
  return data.sort(byName).map(city => ({
    id: city.name,
    name: city.name,
  }))
}
