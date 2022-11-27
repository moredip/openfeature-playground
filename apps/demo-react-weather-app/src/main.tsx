import { OpenFeatureProvider } from '@moredip/openfeature-hooks'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './app/app'

const flags = {
  'include-conditions-in-weather-display': true,
}
OpenFeature.setProvider(new MinimalistProvider(flags))

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <OpenFeatureProvider>
      <App />
    </OpenFeatureProvider>
  </StrictMode>
)
