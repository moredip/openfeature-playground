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

If needed, you can configure the OpenFeatureProvider with a named client:

``` javascript
const openFeatureClient = OpenFeature.getClient('some-specific-context')
export default function App() {
  return (
    <OpenFeatureProvider client={openFeatureClient}>
      <HomePage />
    </OpenFeatureProvider>
  )
}
```




### check the state of a flag
``` javascript
import { useFeatureFlag } from '@moredip/openfeature-hooks'


function HomePage() {
  const showDealOfTheDayFlag = useFeatureFlag('show-deal-of-the-day', false)

  return (
    <div>
      <WelcomeHeader />
      {showDealOfTheDayFlag.value ? <DealOfTheDay /> : null}
      <MainContent />
    </div>
  )
}
```

Note that we use `showDealOfTheDayFlag.value` to get the actual current value of the feature flag.

### checking things beyond just a flag's value

Besides a feature flag's current value, you may also need to know more about how that value
was derived. 

For example, if the flag is not *authoritative* - instead coming from a stale cache or a default value - then you might prefer to display a loading state rather than using a potentially incorrect default value. That's simple enough:

``` javascript
function HomePage() {
  const { value: showDealOfTheDay, isAuthoritative }  = useFeatureFlag('show-deal-of-the-day', false)

  if(!isAuthoritative){
    return <Loading />
  }

  return (
    <div>
      <WelcomeHeader />
      {showDealOfTheDay ? <DealOfTheDay /> : null}
      <MainContent />
    </div>
  )
}

function Loading() {
  return (<div>loading...</div>)
}
```

Besides the feature flag's current value, the result returned from the useFeatureFlag hook includes additional context like `isAuthoritative`, `isDefault`, `isError`, as well as the full `EvaluationDetails` structure from the underlying OpenFeature SDK:

``` javascript
export interface FlagResult<T extends FlagValue> {
  value: T
  isAuthoritative: boolean // is `value` an evaluated result from the flag provider?
  isDefault: boolean // did `value` come from the default value provided to the useFeatureFlag hook?
  isError: boolean // did the provider encounter an error?
  evaluationDetails: EvaluationDetails<T> | null
}
```


