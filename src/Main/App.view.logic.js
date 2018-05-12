import App from './App.view.js'
import React from 'react'
import WaitForAssets from '../WaitForAssets.js'

class AppLogic extends React.Component {
  state = {
    firstTime: true,
    isCities: false,
    isStations: false,
    isMap: false,
  }

  render() {
    return <App {...this.state} />
  }
}

const AppThatWaitedForAssets = props => (
  <WaitForAssets>{() => <AppLogic {...props} />}</WaitForAssets>
)
export default AppThatWaitedForAssets
