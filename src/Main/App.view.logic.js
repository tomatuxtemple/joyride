import * as AsyncStorage from '../async-storage.js'
import App from './App.view.js'
import Location from './Location.js'
import React from 'react'
import WaitForAssets from '../WaitForAssets.js'

class AppLogic extends React.Component {
  state = {
    city: null,
    isCities: false,
    isLoading: true,
    isSetup: false,
    isStations: false,
    isMap: false,
    station: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.state.isReady && prevState.isLoading) {
      return {
        isLoading: false,
        isCities: true,
        // city: 'Dublin',
        // isMap: true,
      }
    }

    return null
  }

  async componentDidMount() {
    const isSetup = await AsyncStorage.getItem('@joyride:setup')

    if (isSetup) {
      this.setState({
        isSetup: true,
      })

      if (this.props.location.state.isReady) {
        this.setState({
          isLoading: false,
          isCities: true,
        })
      }
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  back = () => {
    if (!this.state.isCities) return
    if (!this.state.city) return

    this.setState({
      isCities: false,
      isStations: true,
    })
  }

  chooseCity = city => {
    this.setState({
      city,
      isCities: false,
      isStations: true,
      station: null,
    })
  }

  chooseStation = station => {
    this.setState({
      station,
      isCities: false,
      isStations: false,
      isMap: true,
    })
  }

  goToCities = () => {
    this.setState({
      isCities: true,
      isStations: false,
      station: null,
    })
  }

  goToStations = () => {
    this.setState({
      isMap: false,
      isStations: true,
      station: null,
    })
  }

  setup = async () => {
    await AsyncStorage.setItem('@joyride:setup', true)

    this.setState({
      isSetup: true,
    })
  }

  render() {
    const { props, state } = this
    return (
      <App
        {...state}
        back={this.back}
        canGoBack={state.city !== null}
        chooseCity={this.chooseCity}
        chooseStation={this.chooseStation}
        coords={
          props.location.state.location && props.location.state.location.coords
        }
        goToCities={this.goToCities}
        goToStations={this.goToStations}
        setup={this.setup}
      />
    )
  }
}

const AppThatWaitedForAssets = () => (
  <WaitForAssets>
    {() => <Location>{location => <AppLogic location={location} />}</Location>}
  </WaitForAssets>
)
export default AppThatWaitedForAssets
