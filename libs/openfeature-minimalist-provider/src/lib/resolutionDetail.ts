import { ResolutionDetails } from '@openfeature/js-sdk'

export function bareResolution<U>(value: U): ResolutionDetails<U> {
  return {
    value: value,
  }
}
