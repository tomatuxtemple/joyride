import * as AsyncStorage from '../async-storage.js'
import { Constants, Location, Permissions } from 'expo'
import { Platform } from 'react-native'
import React, { Component } from 'react'

export default class LocationComponent extends Component {
  state = {
    isLoading: false,
    isLocationServicesEnabled: false,
    isPermissionGranted: false,
    isReady: false,
    location: null,
  }

  async componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        isLoading: false,
        isReady: true,
        location: null,
      })
    } else {
      this.checkLocationServices(async () => {
        if (!this.state.isLocationServicesEnabled) return

        const isPermissionGranted = await AsyncStorage.getItem(
          '@joyride:isPermissionGranted'
        )
        if (!isPermissionGranted) {
          this.ready()
          return
        }

        // it might be the case that we think we have permissions
        // but the user revoked them afterwards by hand
        this.askForPermission(() => this.refresh(this.ready))
      })
    }
  }

  askForPermission = async callback => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    const isPermissionGranted = status === 'granted'

    await AsyncStorage.setItem(
      '@joyride:isPermissionGranted',
      isPermissionGranted
    )

    this.setState(
      {
        isPermissionGranted,
        location: null,
      },
      callback
    )
  }

  checkLocationServices = async callback => {
    const service = await Location.getProviderStatusAsync()
    const isLocationServicesEnabled = service.locationServicesEnabled
    this.setState(
      {
        isLocationServicesEnabled,
      },
      callback
    )
  }

  ready = callback => {
    this.setState(
      {
        isLoading: false,
        isReady: true,
      },
      callback
    )
  }

  refresh = async callback => {
    if (
      this.state.isLoading ||
      !this.state.isLocationServicesEnabled ||
      !this.state.isPermissionGranted
    ) {
      if (typeof callback === 'function') {
        callback()
      }
      return
    }

    this.setState({
      isReady: false,
      isLoading: true,
      location: null,
    })

    try {
      this.setState({
        location: await Location.getCurrentPositionAsync(),
      })
    } catch (error) {
      console.error(error)
    }

    this.ready(callback)
  }

  render() {
    return this.props.children({
      askForPermission: this.askForPermission,
      checkLocationServices: this.checkLocationServices,
      state: this.state,
      refresh: this.refresh,
    })
  }
}
