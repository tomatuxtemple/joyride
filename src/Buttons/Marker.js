// @view
import { MapView } from 'expo'
import BikeMarker from './BikeMarker.view.js'
import React from 'react'

export default ({ latitude, longitude, ...props }) => (
  <MapView.Marker
    coordinate={{
      latitude,
      longitude,
    }}
  >
    <BikeMarker {...props} />
  </MapView.Marker>
)
