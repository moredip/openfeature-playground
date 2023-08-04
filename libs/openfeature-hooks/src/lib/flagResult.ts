import { EvaluationDetails, FlagValue } from '@openfeature/js-sdk'

export interface FlagResult<T extends FlagValue> {
  value: T
  isAuthoritative: boolean // is `value` an evaluated result from the flag provider?
  isDefault: boolean // did `value` come from the default value provided to the useFeatureFlag hook?
  isError: boolean // did the provider encounter an error?
  evaluationDetails: EvaluationDetails<T> | null
}

export interface AuthoritativeFlagResult<T extends FlagValue>
  extends FlagResult<T> {
  value: T
  isAuthoritative: true
  isDefault: false
  isError: false
  evaluationDetails: EvaluationDetails<T>
}

export interface ErrorFlagResult<T extends FlagValue> extends FlagResult<T> {
  value: T
  isAuthoritative: false
  isDefault: true
  isError: true
  evaluationDetails: EvaluationDetails<T>
}

export function fromEvaluationDetails<T extends FlagValue>(
  evaluationDetails: EvaluationDetails<T>
): FlagResult<T> {
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
    isError: false,
    isDefault: false,
    evaluationDetails,
  }
}
