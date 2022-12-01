import {
  ErrorCode,
  EvaluationContext,
  JsonValue,
  Logger,
  Provider,
  ResolutionDetails,
  ProviderEvents,
  EventProvider,
} from '@openfeature/js-sdk'
import { EventEmitter } from 'events'

export class ChaosProvider implements Provider, EventProvider {
  readonly metadata = {
    name: 'Chaos Provider',
  } as const

  readonly events = new EventEmitter()

  private _ready = true
  get ready() {
    return this._ready
  }

  private _wrappedProvider: Provider

  private _errorCodeToSimulate: ErrorCode | null = null

  constructor(wrappedProvider: Provider) {
    this._wrappedProvider = wrappedProvider
    // TODO: forwarding events from wrapped provider
  }

  simulateError(errorCode: ErrorCode) {
    this._errorCodeToSimulate = errorCode
  }

  clearSimluatedError() {
    this._errorCodeToSimulate = null
  }

  simulateProviderNotReady() {
    this._ready = false
    this.simulateError(ErrorCode.PROVIDER_NOT_READY)
  }

  simulateProviderBecomingReady() {
    this._ready = true
    this.clearSimluatedError()
    this.events.emit(ProviderEvents.Ready)
  }

  resetChaos() {
    this.clearSimluatedError()
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
      return simulatedError(defaultValue, this._errorCodeToSimulate)
    }
    return null
  }
}

function simulatedError<T>(
  value: T,
  errorCode: ErrorCode
): ResolutionDetails<T> {
  return {
    value,
    errorCode,
  }
}
