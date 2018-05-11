import { AppLoading, Font } from 'expo'
import { Animated } from 'react-native'
import { getLiveInfo, getNearBy } from '../cities/index.js'
import Location from './Location.js'
import NearBy from './NearBy.view.js'
import React from 'react'
import WaitForAssets from '../WaitForAssets.js'

class NearByLogic extends React.Component {
  constructor(props) {
    super(props)

    if (props.location && props.location.coords) {
      this.state = {
        from: getNearBy(props.coords),
        isShowingList: true,
        coords: props.location.coords,
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
      }
    }

    return null
  }

  async componentDidUpdate(prevProps, prevState) {
    const { state } = this

    if (prevState.coords !== state.coords) {
      this.setState({
        from: await getLiveInfo(state.from),
      })
    }
  }

  toggleList = () => {
    this.setState({
      isShowingList: !this.state.isShowingList,
    })
  }

  render() {
    const { props, state } = this

    if (state.isShowingList) {
      return (
        <NearBy
          refresh={props.refresh}
          toggleList={this.toggleList}
          isShowingList
          from={state.from && state.from.slice(0, 10)}
        />
      )
    } else {
      return (
        <NearBy
          refresh={props.refresh}
          toggleList={this.toggleList}
          from={state.from}
          {...state.coords}
        />
      )
    }
  }
}

const NearByWithLocation = props => (
  <Location
    render={location => (
      <NearByLogic {...props} {...location.state} refresh={location.refresh} />
    )}
  />
)

const NearByThatWaitedForAssets = props => (
  <WaitForAssets>{() => <NearByWithLocation {...props} />}</WaitForAssets>
)
export default NearByThatWaitedForAssets
