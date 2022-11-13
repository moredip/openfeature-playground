import { ResolutionDetails, TypeMismatchError } from '@openfeature/js-sdk'
import { MinimalistProvider } from './provider'
describe(MinimalistProvider, () => {
  it('resolves to default true value for an unrecognized bool flag', async () => {
    const provider = new MinimalistProvider()
    const resolution = await provider.resolveBooleanEvaluation(
      'unknown-flag',
      true
    )
    verifyResolution(resolution, { expectedValue: true })
  })

  it('resolves to default false value for an unrecognized bool flag', async () => {
    const provider = new MinimalistProvider()
    const resolution = await provider.resolveBooleanEvaluation(
      'unknown-flag',
      false
    )
    verifyResolution(resolution, { expectedValue: false })
  })

  it('resolves to correct value for a known bool flag', async () => {
    const flags = {
      'go-bananas': true,
    }

    const provider = new MinimalistProvider(flags)

    const resolution = await provider.resolveBooleanEvaluation(
      'go-bananas',
      false
    )
    verifyResolution(resolution, { expectedValue: true })
  })

  describe('string flags', () => {
    let provider: MinimalistProvider
    beforeEach(() => {
      const flags = {
        'a-string-flag': 'configured-value',
        'a-boolean-flag': true,
      }

      provider = new MinimalistProvider(flags)
    })

    it('resolves to the configured value for a known flag', async () => {
      const resolution = await provider.resolveStringEvaluation(
        'a-string-flag',
        'default-value'
      )
      verifyResolution(resolution, { expectedValue: 'configured-value' })
    })

    it('resolves to the default value for an unknown flag', async () => {
      const resolution = await provider.resolveStringEvaluation(
        'unknown-string-flag',
        'default-value'
      )
      verifyResolution(resolution, { expectedValue: 'default-value' })
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
}
