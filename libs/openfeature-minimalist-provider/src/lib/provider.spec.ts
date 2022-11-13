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
      'some-flag': true,
    })

    const firstResolution = await provider.resolveBooleanEvaluation(
      'some-flag',
      false
    )
    verifyResolution(firstResolution, { expectedValue: true })

    provider.replaceConfiguration({
      'some-flag': false,
    })

    const secondResolution = await provider.resolveBooleanEvaluation(
      'some-flag',
      true
    )
    verifyResolution(secondResolution, { expectedValue: false })
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
