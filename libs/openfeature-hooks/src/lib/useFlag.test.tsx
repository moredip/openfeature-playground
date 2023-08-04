import { ChaosWebProvider as ChaosProvider } from '@moredip/openfeature-chaos-provider'
import { WebMinimalistProvider as MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature, StandardResolutionReasons } from '@openfeature/web-sdk'
import { act, renderHook } from '@testing-library/react-hooks'

import { OpenFeatureProvider } from './provider'
import { useFeatureFlag } from './useFlag'

describe('useFlag', () => {
  it('reflects the configured flag value as it changes', async () => {
    const provider = new MinimalistProvider({
      'some-flag': 'initial-value',
    })
    OpenFeature.setProvider(provider)

    const { result } = renderHook(
      () => {
        return useFeatureFlag<string>('some-flag', 'blah')
      },
      { wrapper: OpenFeatureProvider }
    )

    expect(result.current).toMatchObject({
      value: 'initial-value',
      isAuthoritative: true,
      isDefault: false,
      isError: false,
      evaluationDetails: {
        flagKey: 'some-flag',
        value: 'initial-value',
      },
    })

    act(() => {
      provider.replaceConfiguration({
        'some-flag': 'updated-value',
      })
    })

    expect(result.current).toMatchObject({
      value: 'updated-value',
      isAuthoritative: true,
      isDefault: false,
      isError: false,
      evaluationDetails: {
        flagKey: 'some-flag',
        value: 'updated-value',
      },
    })
  })

  it('updates flag value from default to actual value a provider becomes ready', () => {
    const flags = {
      'some-flag': 'configured-value',
    }
    const chaosProvider = new ChaosProvider(new MinimalistProvider(flags))
    chaosProvider.simulateProviderNotReady()
    OpenFeature.setProvider(chaosProvider)

    const { result } = renderHook(
      () => {
        return useFeatureFlag('some-flag', 'default-value')
      },
      { wrapper: OpenFeatureProvider }
    )

    expect(result.current).toMatchObject({
      value: 'default-value',
      isAuthoritative: false,
      isError: true,
      isDefault: true,
      evaluationDetails: {
        flagKey: 'some-flag',
        value: 'default-value',
        reason: StandardResolutionReasons.DEFAULT,
      },
    })

    act(() => {
      chaosProvider.simulateProviderNowReady()
    })

    expect(result.current).toMatchObject({
      value: 'configured-value',
      isAuthoritative: true,
      isError: false,
      isDefault: false,
      evaluationDetails: {
        flagKey: 'some-flag',
        value: 'configured-value',
      },
    })
  })

  it('shows reflects stale feature flags', () => {})
})
