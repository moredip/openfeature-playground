# @moredip/openfeature-minimalist-provider

An *extremely* simple OpenFeature provider, intended for simple demos and as a test stub.

Flag values are entirely static - evaluation context is ignored and there's no way to update the flags at runtime. 

Only supports boolean and string flags.


## Getting started

### install it
```npm install @moredip/openfeature-minimalist-provider @openfeature/js-sdk```
*note that @openfeature/js-sdk is a required peer dependency*

### set up the provider with some flag values
```
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'

const flags = {
  'a-boolean-flag': true,
  'a-string-flag': 'the flag value',
}
const provider = new MinimalistProvider(flags)
OpenFeature.setProvider(provider)
```

### check a flag's value
```
// create a client
const client = OpenFeature.getClient('my-app');

// get a bool value
const boolValue = await client.getBooleanValue('a-boolean-flag', false);
```

## Development

This monorepo uses Nx. 
### Building
`yarn nx build openfeature-minimalist-provider`
### Running unit tests
`yarn nx test openfeature-minimalist-provider`

### Publishing a new version
- bump the version in `package.json`
- `NPM_OTP=XXXXX yarn nx run openfeature-minimalist-provider:publish`
