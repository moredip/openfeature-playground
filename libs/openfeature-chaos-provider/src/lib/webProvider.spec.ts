import { ChaosWebProvider } from './webProvider'
import { MinimalistProvider } from '@moredip/openfeature-minimalist-provider/web'
import { ErrorCode, Logger } from '@openfeature/web-sdk'

describe(ChaosWebProvider, () => {
  it('calls through to the wrapped provider', async () => {
    const wrappedProvider = new MinimalistProvider({
      'some-flag': 'the-wrapped-value',
    })
    const chaosProvider = new ChaosWebProvider(wrappedProvider)

    const result = await chaosProvider.resolveStringEvaluation(
      'some-flag',
      'blah',
      {},
      NOOP_LOGGER
    )
    expect(result.value).toBe('the-wrapped-value')
  })

  it('returns error codes and defaults when asked', async () => {
    const wrappedProvider = new MinimalistProvider({
      'some-flag': 'the-wrapped-value',
    })
    const chaosProvider = new ChaosWebProvider(wrappedProvider)

    chaosProvider.simulateError(ErrorCode.TYPE_MISMATCH)

    let result = await chaosProvider.resolveStringEvaluation(
      'some-flag',
      'the default',
      {},
      NOOP_LOGGER
    )

    expect(result.value).toBe('the default')
    expect(result.errorCode).toBe(ErrorCode.TYPE_MISMATCH)

    chaosProvider.simulateError(ErrorCode.PROVIDER_NOT_READY)
    result = await chaosProvider.resolveStringEvaluation(
      'some-flag',
      'the default',
      {},
      NOOP_LOGGER
    )

    expect(result.value).toBe('the default')
    expect(result.errorCode).toBe(ErrorCode.PROVIDER_NOT_READY)

    chaosProvider.resetChaos()
    result = await chaosProvider.resolveStringEvaluation(
      'some-flag',
      'the default',
      {},
      NOOP_LOGGER
    )

    expect(result.value).toBe('the-wrapped-value')
    expect(result.errorCode).toBeUndefined()
  })
})

/* eslint-disable @typescript-eslint/no-empty-function */
const NOOP_LOGGER: Logger = {
  error(...args: unknown[]): void {},
  warn(...args: unknown[]): void {},
  info(...args: unknown[]): void {},
  debug(...args: unknown[]): void {},
}
