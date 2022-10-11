import {
  EvaluationContext,
  JsonValue,
  Provider,
  ResolutionDetails,
  TypeMismatchError,
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

  async resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<boolean>> {
    if (!(flagKey in this._flagConfiguration)) {
      return bareResolution(defaultValue)
    }
    const flagValue = this._flagConfiguration[flagKey]
    if (typeof flagValue !== 'boolean') {
      throw new TypeMismatchError()
    }

    return bareResolution(flagValue)
  }

  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext = {}
  ): Promise<ResolutionDetails<string>> {
    throw new Error('Not supported')
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
