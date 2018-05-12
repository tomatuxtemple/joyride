import { getLiveInfo, getNearBy } from '../cities/index.js'
import Location from './Location.js'
import Stations from './Stations.view.js'
import React from 'react'

class StationsLogic extends React.Component {
  constructor(props) {
    super(props)

    if (props.location && props.location.coords) {
      this.state = {
        coords: props.location.coords,
        from: getNearBy(props.coords),
        isShowingList: true,
      }
    } else {
      this.state = {
        isShowingList: true,
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location && nextProps.location.coords !== prevState.coords) {
      return {
        from: getNearBy(nextProps.location.coords),
        coords: nextProps.location.coords,
        isLoading: nextProps.isLoading,
        isReady: nextProps.isReady,
        station: null,
      }
    }

    return null
  }

  async componentDidUpdate(prevProps, prevState) {
    const { state } = this

    if (prevState.coords !== state.coords) {
      this.setState({
        isLoading: true,
        isReady: false,
      })

      this.setState({
        from: await getLiveInfo(state.from),
        isLoading: false,
        isReady: true,
        station: null,
      })
    }
  }

  findStation = station => {
    this.setState({
      isShowingList: false,
      station,
    })
  }

  // toggleList = () => {
  //   this.setState({
  //     isShowingList: !this.state.isShowingList,
  //     station: null,
  //   })
  // }

  render() {
    const { props, state } = this

    return (
      <Stations
        findStation={this.findStation}
        from={state.from && state.from.slice(0, 10)}
        isLoading={state.isLoading}
        isReady={state.isReady}
        refresh={props.refresh}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      />
    )
    // } else {
    //   return (
    //     <Stations
    //       from={state.from}
    //       isLoading={props.isLoading}
    //       isReady={state.isReady}
    //       refresh={state.refresh}
    //       toggleList={this.toggleList}
    //       contentContainerStyle={{
    //         paddingBottom: 200,
    //       }}
    //       {...(state.station ? state.station : state.coords)}
    //     />
    //   )
    // }
  }
}

const StationsWithLocation = props => (
  <Location
    render={location => (
      <StationsLogic
        {...props}
        {...location.state}
        refresh={location.refresh}
      />
    )}
  />
)
export default StationsWithLocation
