import {
  ErrorCode,
  EvaluationContext,
  JsonValue,
  Logger,
  Provider,
  ResolutionDetails,
} from '@openfeature/web-sdk'

export class ChaosWebProvider implements Provider {
  readonly metadata = {
    name: 'Chaos Provider',
  } as const
  private _wrappedProvider: Provider

  private _errorCodeToSimulate: ErrorCode | null = null

  constructor(wrappedProvider: Provider) {
    this._wrappedProvider = wrappedProvider
  }

  simulateError(errorCode: ErrorCode) {
    this._errorCodeToSimulate = errorCode
  }

  simulateProviderNotReady() {
    this.simulateError(ErrorCode.PROVIDER_NOT_READY)
  }

  resetChaos() {
    this._errorCodeToSimulate = null
  }

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<boolean> {
    const simulatedResolution =
      this.generateSimulatedResolutionIfAppropriate(defaultValue)

    if (simulatedResolution) {
      return simulatedResolution
    }

    return this._wrappedProvider.resolveBooleanEvaluation(
      flagKey,
      defaultValue,
      context,
      logger
    )
  }
  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<string> {
    const simulatedResolution =
      this.generateSimulatedResolutionIfAppropriate(defaultValue)

    if (simulatedResolution) {
      return simulatedResolution
    }

    return this._wrappedProvider.resolveStringEvaluation(
      flagKey,
      defaultValue,
      context,
      logger
    )
  }
  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<number> {
    throw new Error('Method not implemented.')
  }
  resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<T> {
    throw new Error('Method not implemented.')
  }

  private generateSimulatedResolutionIfAppropriate<T extends JsonValue>(
    defaultValue: T
  ): ResolutionDetails<T> | null {
    if (this._errorCodeToSimulate) {
      return simulateError(defaultValue, this._errorCodeToSimulate)
    }
    return null
  }
}

function simulateError<T>(
  value: T,
  errorCode: ErrorCode
): ResolutionDetails<T> {
  return {
    value,
    errorCode,
  }
}
