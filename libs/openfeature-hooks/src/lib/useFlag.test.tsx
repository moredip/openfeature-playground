import { MinimalistProvider } from '@openfeature-sandbox/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import { renderHook } from '@testing-library/react-hooks'

import { OpenFeatureProvider } from './provider'
import { useStringFeatureFlag } from './useFlag'

describe('useFlag', () => {
  describe('happy path', () => {
    it('eventually yields the configured value', async () => {
      const flags = {
        'some-flag': 'configured-value',
      }
      const provider = new MinimalistProvider(flags)
      OpenFeature.setProvider(provider)

      const { result, waitForNextUpdate } = renderHook(
        () => {
          return useStringFeatureFlag('some-flag', 'default-value')
        },
        { wrapper: OpenFeatureProvider }
      )

      // on first render the feature flag will always return the default
      // value, because the flag lookup is an async operation, but a
      // render is sync and the hook has to return *something*.
      expect(result.current).toEqual('default-value')

      await waitForNextUpdate()

      expect(result.current).toEqual('configured-value')
    })
  })
})
