import {
  JsonValue,
  Provider,
  EventProvider,
  ProviderEvents,
  ResolutionDetails,
  StandardResolutionReasons,
  TypeMismatchError,
  FlagNotFoundError,
  EvaluationContext,
} from '@openfeature/js-sdk'
import { EventEmitter } from 'events'

import { FlagConfiguration } from './flagConfiguration'
import { bareResolution } from './resolutionDetail'

export class MinimalistProvider implements Provider, EventProvider {
  readonly metadata = {
    name: 'Minimalist Provider',
  } as const
  readonly events = new EventEmitter()

  private _ready = true
  get ready() {
    return this._ready
  }

  private _flagConfiguration: FlagConfiguration

  constructor(flagConfiguration: FlagConfiguration = {}) {
    this._flagConfiguration = flagConfiguration
  }

  replaceConfiguration(flagConfiguration: FlagConfiguration) {
    this._flagConfiguration = flagConfiguration
    this.events.emit(ProviderEvents.ConfigurationChanged)
  }

  async resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<boolean>> {
    if (!(flagKey in this._flagConfiguration)) {
      throw new FlagNotFoundError()
    }
    const flagValue = this._flagConfiguration[flagKey]
    if (typeof flagValue !== 'boolean') {
      throw new TypeMismatchError()
    }

    return bareResolution(flagValue, StandardResolutionReasons.DEFAULT)
  }

  async resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<string>> {
    if (!(flagKey in this._flagConfiguration)) {
      throw new FlagNotFoundError()
    }
    const flagValue = this._flagConfiguration[flagKey]
    if (typeof flagValue !== 'string') {
      throw new TypeMismatchError()
    }

    return bareResolution(flagValue, StandardResolutionReasons.DEFAULT)
  }

  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<number>> {
    throw new Error('Not supported')
  }

  resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<T>> {
    throw new Error('Not supported')
  }
}
