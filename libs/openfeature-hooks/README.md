# openfeature-hooks

Use Open Feature feature flags in your React app via a delightful hook.

## Getting started

### install the library
```yarn install @moredip/openfeature-hooks```

### configure OpenFeature and add the provider
``` javascript
import { OpenFeatureProvider } from '@moredip/openfeature-hooks'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'

// OpenFeature needs to be configured with a 'flag provider'. In this example
// we'll use the super-simple MinimalistProvider, but you are free to use any
// provider you wish (i.e. LaunchDarkly, Split, Cloudbees, and more)
const provider = new MinimalistProvider({
  'show-deal-of-the-day': true,
})
OpenFeature.setProvider(provider)

// we also need to wrap our React component tree in a `<OpenFeatureProvider>`
export default function App() {
  return (
    <OpenFeatureProvider>
      <HomePage />
    </OpenFeatureProvider>
  )
}
```

### check the state of a flag
``` javascript
import { useFeatureFlag } from '@moredip/openfeature-hooks'


function HomePage() {
  const showDealOfTheDay = useFeatureFlag('show-deal-of-the-day', false)

  return (
    <div>
      <WelcomeHeader />
      {showDealOfTheDay.value ? <DealOfTheDay /> : null}
      <MainContent />
    </div>
  )
}
```
