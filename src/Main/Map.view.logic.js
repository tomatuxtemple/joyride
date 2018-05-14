import Map from './Map.view.js'
import React from 'react'
import Stations from './Stations.js'

export default props => (
  <Stations {...props}>
    {({ state, refresh }) => (
      <Map {...props} {...state.coords} from={state.from} />
    )}
  </Stations>
)
