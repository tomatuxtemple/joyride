// @view
import { MapView } from 'expo'
import React from 'react'

export default ({ children, marginTop, showsUserLocation, latitude, longitude }) => (
  <MapView
    style={{ flex: 1, marginTop }}
    showsUserLocation={showsUserLocation}
    initialRegion={{
      latitude,
      longitude,
      latitudeDelta: 0.0100,
      longitudeDelta: 0.0020,
    }}
  >
    {children}
  </MapView>
)
