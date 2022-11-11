import { ResolutionDetails } from '@openfeature/js-sdk'
import { useEffect, useState } from 'react'
import { useOpenFeatureClient } from './provider'

export function useBooleanFeatureFlag(flagName: string, defaultValue: boolean) {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<ResolutionDetails<boolean> | null>(null)

  const client = useOpenFeatureClient()

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
