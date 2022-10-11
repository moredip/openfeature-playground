import { ResolutionDetails, OpenFeature } from '@openfeature/js-sdk'
import { useEffect, useState } from 'react'

export function useBooleanFeatureFlag(flagName: string, defaultValue: boolean) {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<ResolutionDetails<boolean> | null>(null)

  const client = OpenFeature.getClient()

  useEffect(() => {
    async function getFlag() {
      const flagDetails = await client.getBooleanDetails(flagName, defaultValue)
      console.log({ flagDetails })
      setFlagEvaluationDetails(flagDetails)
    }

    getFlag()
  }, [flagName, defaultValue])

  if (flagEvaluationDetails) {
    return flagEvaluationDetails.value
  } else {
    return defaultValue
  }
}
