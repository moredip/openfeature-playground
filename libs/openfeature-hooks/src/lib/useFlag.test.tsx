import { ChaosProvider } from '@moredip/openfeature-chaos-provider'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import { renderHook } from '@testing-library/react-hooks'

import { OpenFeatureProvider } from './provider'
import { useFeatureFlag } from './useFlag'

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
          return useFeatureFlag<string>('some-flag', 'default-value')
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

  describe('sad paths', () => {
    it.skip('provider initially not ready', async () => {
      const flags = {
        'some-flag': 'configured-value',
      }
      const chaosProvider = new ChaosProvider(new MinimalistProvider(flags))
      chaosProvider.simulateProviderNotReady()
      OpenFeature.setProvider(chaosProvider)

      const { result, waitForNextUpdate } = renderHook(
        () => {
          return useFeatureFlag<string>('some-flag', 'default-value')
        },
        { wrapper: OpenFeatureProvider }
      )

      expect(result.current).toEqual('default-value') // default value on initial render

      await waitForNextUpdate()

      expect(result.current).toEqual('default-value') // default value because provider is not ready

      chaosProvider.resetChaos()
      await waitForNextUpdate()

      expect(result.current).toEqual('configured-value')
    })
  })
})
