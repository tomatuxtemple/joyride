import React from 'react'
import Station from './Station.view.js'

export default ({ onClick, ...props }) => (
  <Station
    {...props}
    distance={
      props.distance >= 1000
        ? (props.distance / 1000 * 100) % 100
        : props.distance
    }
    onClick={() => onClick(props)}
    unit={props.distance >= 1000 ? 'km' : 'm'}
  />
)
