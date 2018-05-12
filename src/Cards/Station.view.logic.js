import React from 'react'
import Station from './Station.view.js'

const A_KM = 1000
const A_1000_KM = A_KM * 100

const approximate = distance => Math.ceil(distance / 5) * 5

export default ({ onClick, ...props }) => (
  <Station
    {...props}
    distance={
      props.distance >= A_KM
        ? props.distance >= A_1000_KM
          ? '∞'
          : Math.round(props.distance / A_KM)
        : approximate(props.distance)
    }
    onClick={() => onClick(props)}
    unit={props.distance >= A_KM ? 'km' : 'm'}
  />
)
