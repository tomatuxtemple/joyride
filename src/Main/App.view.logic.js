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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.state.isReady && prevState.isLoading) {
      return {
        isLoading: false,
        isCities: true,
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
    })
  }

  goToCities = () => {
    this.setState({
      isCities: true,
      isStations: false,
    })
  }

  setup = async () => {
    await AsyncStorage.setItem('@joyride:setup', true)

    this.setState({
      isSetup: true,
    })
  }

  render() {
    const { state } = this
    return (
      <App
        {...state}
        back={this.back}
        canGoBack={state.city !== null}
        chooseCity={this.chooseCity}
        goToCities={this.goToCities}
        setup={this.setup}
      />
    )
  }
}

const AppWithLocation = props => (
  <Location render={location => <AppLogic {...props} location={location} />} />
)

const AppThatWaitedForAssets = () => (
  <WaitForAssets>{() => <AppWithLocation />}</WaitForAssets>
)
export default AppThatWaitedForAssets
