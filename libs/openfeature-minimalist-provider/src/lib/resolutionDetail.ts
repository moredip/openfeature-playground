import { ResolutionDetails, ResolutionReason } from '@openfeature/js-sdk'

export function bareResolution<U>(
  value: U,
  reason?: ResolutionReason
): ResolutionDetails<U> {
  return {
    value,
    reason,
  }
}
