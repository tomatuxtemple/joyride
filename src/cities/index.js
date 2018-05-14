import Amiens from './Amiens.json'
import Besancon from './Besancon.json'
import Brisbane from './Brisbane.json'
import BruxellesCapitale from './Bruxelles-Capitale.json'
import CergyPontoise from './Cergy-Pontoise.json'
import Creteil from './Creteil.json'
import Dublin from './Dublin.json'
import Goteborg from './Goteborg.json'
import Kazan from './Kazan.json'
import Lillestrom from './Lillestrom.json'
import Ljubljana from './Ljubljana.json'
import Lund from './Lund.json'
import Luxembourg from './Luxembourg.json'
import Lyon from './Lyon.json'
import Marseille from './Marseille.json'
import Mulhouse from './Mulhouse.json'
import Namur from './Namur.json'
import Nancy from './Nancy.json'
import Nantes from './Nantes.json'
import Rouen from './Rouen.json'
import Santander from './Santander.json'
import Seville from './Seville.json'
import Stockholm from './Stockholm.json'
import Toulouse from './Toulouse.json'
import Toyama from './Toyama.json'
import Valence from './Valence.json'
import Vilnius from './Vilnius.json'

import getDistance from './get-distance.js'

const mapStation = station => ({
  address: station.address,
  id: station.name,
  latitude: station.latitude,
  longitude: station.longitude,
  number: station.number,
  freeBikes: '-',
  emptySpaces: '-',
})

export const cities = {
  Amiens: {
    area: {},
    stations: Amiens.map(mapStation),
  },
  Besancon: {
    area: {},
    stations: Besancon.map(mapStation),
  },
  Brisbane: {
    area: {},
    stations: Brisbane.map(mapStation),
  },
  'Bruxelles-Capitale': {
    area: {},
    stations: BruxellesCapitale.map(mapStation),
  },
  'Cergy-Pontoise': {
    area: {},
    stations: CergyPontoise.map(mapStation),
  },
  Creteil: {
    area: {},
    stations: Creteil.map(mapStation),
  },
  Dublin: {
    area: [
      // top left
      {
        latitued: 53.7004,
        longitude: -7.077924,
      },
      // top right
      {
        latitude: 53.63531,
        longitude: -5.990278,
      },
      // bottom right
      {
        latitude: 53.002011,
        longitude: -5.957319,
      },
      // bottom left
      {
        latitude: 52.973903,
        longitude: -6.830732,
      },
    ],
    stations: Dublin.map(mapStation),
  },
  Goteborg: {
    area: {},
    stations: Goteborg.map(mapStation),
  },
  Kazan: {
    area: {},
    stations: Kazan.map(mapStation),
  },
  Lillestrom: {
    area: {},
    stations: Lillestrom.map(mapStation),
  },
  Ljubljana: {
    area: {},
    stations: Ljubljana.map(mapStation),
  },
  Lund: {
    area: {},
    stations: Lund.map(mapStation),
  },
  Luxembourg: {
    area: {},
    stations: Luxembourg.map(mapStation),
  },
  Lyon: {
    area: {},
    stations: Lyon.map(mapStation),
  },
  Marseille: {
    area: {},
    stations: Marseille.map(mapStation),
  },
  Mulhouse: {
    area: {},
    stations: Mulhouse.map(mapStation),
  },
  Namur: {
    area: {},
    stations: Namur.map(mapStation),
  },
  Nancy: {
    area: {},
    stations: Nancy.map(mapStation),
  },
  Nantes: {
    area: {},
    stations: Nantes.map(mapStation),
  },
  Rouen: {
    area: {},
    stations: Rouen.map(mapStation),
  },
  Santander: {
    area: {},
    stations: Santander.map(mapStation),
  },
  Seville: {
    area: {},
    stations: Seville.map(mapStation),
  },
  Stockholm: {
    area: {},
    stations: Stockholm.map(mapStation),
  },
  Toulouse: {
    area: {},
    stations: Toulouse.map(mapStation),
  },
  Toyama: {
    area: {},
    stations: Toyama.map(mapStation),
  },
  Valence: {
    area: {},
    stations: Valence.map(mapStation),
  },
  Vilnius: {
    area: {},
    stations: Vilnius.map(mapStation),
  },
}

export const list = Object.keys(cities).map(id => ({
  id,
  name: id,
}))

const sortAlphabetically = (a, b) => (a < b ? -1 : a === b ? 0 : 1)
const byDistance = (a, b) => a.distance - b.distance
const byAddress = (a, b) => sortAlphabetically(a.address, b.address)
const byName = (a, b) => sortAlphabetically(a.name, b.name)

export const getStations = (city, coords) =>
  !coords
    ? cities[city].stations.sort(byAddress)
    : cities[city].stations
        .map(station => {
          return {
            ...station,
            distance: getDistance(coords, station),
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
  console.log(data)
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
