import {
  EvaluationContext,
  JsonValue,
  Provider,
  ResolutionDetails,
  StandardResolutionReasons,
  TypeMismatchError,
  FlagNotFoundError
} from '@openfeature/js-sdk'
import { FlagConfiguration } from './flagConfiguration'
import { bareResolution } from './resolutionDetail'

export class MinimalistProvider implements Provider {
  readonly metadata = {
    name: 'Minimalist Provider',
  } as const
  private _flagConfiguration: FlagConfiguration

  constructor(flagConfiguration: FlagConfiguration = {}) {
    this._flagConfiguration = flagConfiguration
  }

  replaceConfiguration(flagConfiguration: FlagConfiguration) {
    this._flagConfiguration = flagConfiguration
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
