import { ChaosProvider } from '@moredip/openfeature-chaos-provider'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import { renderHook } from '@testing-library/react-hooks'

import { OpenFeatureProvider } from './provider'
import { useFeatureFlag } from './useFlag'

describe('useFlag', () => {
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
    expect(result.current).toMatchObject({
      value: 'default-value',
      isAuthoritative: false,
      isEvaluating: true,
      isDefault: true,
      isError: false,
    })

    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      value: 'configured-value',
      isAuthoritative: true,
      isEvaluating: false,
      isDefault: false,
      isError: false,
    })
  })

  it('updates flag value as provider configuration changes', async () => {
    const provider = new MinimalistProvider({
      'some-flag': 'initial-value',
    })
    OpenFeature.setProvider(provider)

    const { result, waitForNextUpdate } = renderHook(
      () => {
        return useFeatureFlag<string>('some-flag', 'blah')
      },
      { wrapper: OpenFeatureProvider }
    )

    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      value: 'initial-value',
      isAuthoritative: true,
      isEvaluating: false,
      isDefault: false,
      isError: false,
    })

    provider.replaceConfiguration({
      'some-flag': 'updated-value',
    })

    await waitForNextUpdate()
    expect(result.current).toMatchObject({
      value: 'updated-value',
      isAuthoritative: true,
      isEvaluating: false,
      isDefault: false,
      isError: false,
    })
  })

  it('updates flag value from default to actual value a provider becomes ready', async () => {
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

    // initial result before provider has had a chance to evalute the flag
    expect(result.current).toMatchObject({
      value: 'default-value',
      isAuthoritative: false,
      isDefault: true,
      isEvaluating: true,
      isError: false,
    })

    await waitForNextUpdate()

    // flag result changes to indicate that provider that it is not ready
    expect(result.current).toMatchObject({
      value: 'default-value',
      isAuthoritative: false,
      isDefault: true,
      isEvaluating: false,
      isError: true,
    })

    chaosProvider.simulateProviderBecomingReady()
    await waitForNextUpdate()

    // updated flag result now that provider is ready
    expect(result.current).toMatchObject({
      value: 'configured-value',
      isAuthoritative: true,
      isDefault: false,
      isEvaluating: false,
      isError: false,
    })
  })
})
