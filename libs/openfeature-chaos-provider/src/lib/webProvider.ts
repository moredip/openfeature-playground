import {
  ErrorCode,
  EvaluationContext,
  JsonValue,
  Logger,
  OpenFeatureEventEmitter,
  Provider,
  ProviderEvents,
  ResolutionDetails,
  ResolutionReason,
  StandardResolutionReasons,
} from '@openfeature/web-sdk'

export class ChaosWebProvider implements Provider {
  readonly metadata = {
    name: 'Chaos Provider',
  } as const
  private _wrappedProvider: Provider

  events = new OpenFeatureEventEmitter()

  private _errorCodeToSimulate: ErrorCode | null = null
  private _resolutionReasonToSimulate: ResolutionReason | null = null

  constructor(wrappedProvider: Provider) {
    this._wrappedProvider = wrappedProvider
  }

  simulateError(
    errorCode: ErrorCode,
    resolutionReason: ResolutionReason | null = null
  ) {
    this._errorCodeToSimulate = errorCode
    this._resolutionReasonToSimulate = resolutionReason
  }

  simulateProviderNotReadyDelay(delayMs: number) {
    this.simulateProviderNotReady()
    setTimeout(() => {
      this.simulateProviderNowReady()
    }, delayMs)
  }

  simulateProviderNotReady() {
    this.simulateError(
      ErrorCode.PROVIDER_NOT_READY,
      StandardResolutionReasons.DEFAULT
    )
  }

  resetChaos() {
    this._errorCodeToSimulate = null
    this._resolutionReasonToSimulate = null
  }

  simulateProviderNowReady() {
    this.resetChaos()
    this.events.emit(ProviderEvents.Ready)
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
      return {
        value: defaultValue,
        errorCode: this._errorCodeToSimulate,
        reason:
          this._resolutionReasonToSimulate ?? StandardResolutionReasons.ERROR,
      }
    }
    return null
  }
}
