import { EvaluationDetails, FlagValue } from '@openfeature/js-sdk'

export interface FlagResult<T extends FlagValue> {
  value: T
  isAuthoritative: boolean // is `value` an evaluated result from the flag provider?
  isEvaluating: boolean // are we still waiting for the provider to provide a result?
  isDefault: boolean // did `value` come from the default value provided to the useFeatureFlag hook?
  isError: boolean // did the provider encounter an error?
  evaluationDetails: EvaluationDetails<T> | null
}

export interface AuthoritativeFlagResult<T extends FlagValue>
  extends FlagResult<T> {
  value: T
  isAuthoritative: true
  isEvaluating: false
  isDefault: false
  isError: false
  evaluationDetails: EvaluationDetails<T>
}

export interface EvaluatingFlagResult<T extends FlagValue>
  extends FlagResult<T> {
  value: T
  isAuthoritative: false
  isEvaluating: true
  isDefault: true
  isError: false
  evaluationDetails: null
}

export interface ErrorFlagResult<T extends FlagValue> extends FlagResult<T> {
  value: T
  isAuthoritative: false
  isEvaluating: false
  isDefault: true
  isError: true
  evaluationDetails: EvaluationDetails<T>
}

export function fromEvaluationDetails<T extends FlagValue>(
  defaultValue: T,
  evaluationDetails: EvaluationDetails<T> | null
): FlagResult<T> {
  if (null == evaluationDetails) {
    return evaluatingResult(defaultValue)
  }

  if (evaluationDetails.errorCode) {
    return errorResult(evaluationDetails)
  } else {
    return authoritativeResult(evaluationDetails)
  }
}

function errorResult<T extends FlagValue>(
  evaluationDetails: EvaluationDetails<T>
): ErrorFlagResult<T> {
  return {
    value: evaluationDetails.value,
    isAuthoritative: false,
    isEvaluating: false,
    isError: true,
    isDefault: true,
    evaluationDetails,
  }
}

function authoritativeResult<T extends FlagValue>(
  evaluationDetails: EvaluationDetails<T>
): AuthoritativeFlagResult<T> {
  return {
    value: evaluationDetails.value,
    isAuthoritative: true,
    isEvaluating: false,
    isError: false,
    isDefault: false,
    evaluationDetails,
  }
}

function evaluatingResult<T extends FlagValue>(
  defaultValue: T
): EvaluatingFlagResult<T> {
  return {
    value: defaultValue,
    isAuthoritative: false,
    isEvaluating: true,
    isError: false,
    isDefault: true,
    evaluationDetails: null,
  }
}
