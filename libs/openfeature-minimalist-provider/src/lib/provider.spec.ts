import {
  ResolutionDetails,
  StandardResolutionReasons,
  TypeMismatchError,
  FlagNotFoundError,
} from '@openfeature/js-sdk'
import { MinimalistProvider } from './provider'
describe(MinimalistProvider, () => {
  let provider: MinimalistProvider
  beforeEach(() => {
    const flags = {
      'a-string-flag': 'configured-value',
      'a-boolean-flag': true,
    }
    provider = new MinimalistProvider(flags)
  })

  describe('boolean flags', () => {
    it('resolves to the configured value for a known flag', async () => {
      const resolution = await provider.resolveBooleanEvaluation(
        'a-boolean-flag',
        false
      )
      verifyResolution(resolution, { expectedValue: true })
    })

    it('throws when asked for an unrecognized flag', async () => {
      const evaluation = provider.resolveBooleanEvaluation('unknown-flag', true)
      expect(evaluation).rejects.toThrow(FlagNotFoundError)
    })
  })

  describe('string flags', () => {
    it('resolves to the configured value for a known flag', async () => {
      const resolution = await provider.resolveStringEvaluation(
        'a-string-flag',
        'default-value'
      )
      verifyResolution(resolution, { expectedValue: 'configured-value' })
    })

    it('throws when asked for an unrecognized flag', async () => {
      const evaluation = provider.resolveStringEvaluation(
        'unknown-string-flag',
        'default-value'
      )
      expect(evaluation).rejects.toThrow(FlagNotFoundError)
    })

    it('throws a TypeMismatchError when asked to resolve a non-string flag', async () => {
      const evaluation = provider.resolveStringEvaluation(
        'a-boolean-flag',
        'blah'
      )

      expect(evaluation).rejects.toThrow(TypeMismatchError)
    })
  })

  it('throws a TypeMismatchError when appropriate', async () => {
    const flags = {
      'numeric-flag': 123,
    }

    const provider = new MinimalistProvider(flags)

    const evaluation = provider.resolveBooleanEvaluation('numeric-flag', false)

    expect(evaluation).rejects.toThrow(TypeMismatchError)
  })

  it('reflects changes in flag configuration', async () => {
    const provider = new MinimalistProvider({
      'some-flag': 'initial-value',
    })

    const firstResolution = await provider.resolveStringEvaluation(
      'some-flag',
      'default'
    )
    verifyResolution(firstResolution, { expectedValue: 'initial-value' })

    provider.replaceConfiguration({
      'some-flag': 'updated-value',
    })

    const secondResolution = await provider.resolveStringEvaluation(
      'some-flag',
      'blah'
    )
    verifyResolution(secondResolution, { expectedValue: 'updated-value' })
  })
})

type VerifyResolutionParams<U> = {
  expectedValue: U
}

function verifyResolution<U>(
  resolution: ResolutionDetails<U>,
  { expectedValue }: VerifyResolutionParams<U>
) {
  expect(resolution.value).toBe(expectedValue)
  expect(resolution.reason).toBe(StandardResolutionReasons.DEFAULT)
  expect(resolution.errorCode).toBeUndefined()
}
