import {
  ErrorCode,
  EvaluationContext,
  JsonValue,
  Logger,
  Provider,
  ResolutionDetails,
} from '@openfeature/js-sdk'

export class ChaosProvider implements Provider {
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

  resetChaos() {
    this._errorCodeToSimulate = null
  }

  async resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext,
    logger: Logger
  ): Promise<ResolutionDetails<boolean>> {
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
  async resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext,
    logger: Logger
  ): Promise<ResolutionDetails<string>> {
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
  ): Promise<ResolutionDetails<number>> {
    throw new Error('Method not implemented.')
  }
  resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    logger: Logger
  ): Promise<ResolutionDetails<T>> {
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
