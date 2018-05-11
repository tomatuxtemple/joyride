import { Constants, Location, Permissions } from 'expo'
import { Platform } from 'react-native'
import React, { Component } from 'react'

export default class App extends Component {
  state = {
    error: null,
    isReady: false,
    isLoading: false,
    location: null,
  }

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        error:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        isLoading: false,
        isReady: true,
        location: null,
      })
    } else {
      this.refresh()
    }
  }

  refresh = async () => {
    if (this.state.isLoading) return

    this.setState({
      error: null,
      isReady: false,
      isLoading: true,
      location: null,
    })

    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status !== 'granted') {
      this.setState({
        error: 'Permission to access location was denied',
        isReady: true,
        isLoading: false,
        location: null,
      })
      return
    }

    const location = await Location.getCurrentPositionAsync({})

    this.setState({
      error: null,
      isLoading: false,
      isReady: true,
      location,
    })
  }

  render() {
    return this.props.render({
      state: this.state,
      refresh: this.refresh,
    })
  }
}
