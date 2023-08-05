import { OpenFeatureProvider } from '@moredip/openfeature-hooks'
import { WebMinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { ChaosWebProvider } from '@moredip/openfeature-chaos-provider'
import { OpenFeature } from '@openfeature/web-sdk'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './app/app'

const flags = {
  'include-conditions-in-weather-display': true,
}
const provider = new WebMinimalistProvider(flags)
const chaosProvider = new ChaosWebProvider(provider)

OpenFeature.setProvider(provider)
OpenFeature.setProvider('delayed', chaosProvider)

// simulate a 1 second delay before authoritative feature flags are available
chaosProvider.simulateProviderNotReadyDelay(1000)

const openFeatureClient = OpenFeature.getClient('delayed')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <OpenFeatureProvider client={openFeatureClient}>
      <App />
    </OpenFeatureProvider>
  </StrictMode>
)
