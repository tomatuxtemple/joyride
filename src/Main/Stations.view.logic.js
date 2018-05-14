import { getLiveInfo, getStations } from '../cities/index.js'
import Location from './Location.js'
import Stations from './Stations.view.js'
import React from 'react'

export default class StationsLogic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      coords: props.coords,
      from: getStations(props.city, props.coords),
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.coords !== prevState.coords) {
      return {
        from: getStations(nextProps.city, nextProps.coords),
        coords: nextProps.coords,
      }
    }

    return null
  }

  componentDidMount() {
    this.getLiveInfo()
  }

  componentDidUpdate(prevProps, prevState) {
    const { state } = this
    if (prevState.coords !== state.coords) {
      this.getLiveInfo()
    }
  }

  async getLiveInfo() {
    const { props, state } = this

    this.setState({
      from: await getLiveInfo(props.city, state.from),
    })
  }

  render() {
    const { props, state } = this

    return (
      <Stations
        goToCities={props.goToCities}
        from={state.from}
        refresh={props.refresh}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      />
    )
  }
}
