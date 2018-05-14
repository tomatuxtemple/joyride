import React from 'react'
import Stations from './Stations.js'
import StationsView from './Stations.view.js'

export default props => (
  <Stations
    {...props}
    render={({ state, refresh }) => (
      <StationsView
        {...props}
        from={state.from}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      />
    )}
  />
)
