import {
  Client,
  EvaluationDetails,
  FlagValue,
  ResolutionDetails,
} from '@openfeature/js-sdk'
import { useEffect, useState } from 'react'
import { useOpenFeatureClient } from './provider'

export function useBooleanFeatureFlag(
  flagName: string,
  defaultValue: boolean
): boolean {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<ResolutionDetails<boolean> | null>(null)

  const client = useOpenFeatureClient()

  useEffect(() => {
    async function getFlag() {
      const flagDetails = await client.getBooleanDetails(flagName, defaultValue)
      setFlagEvaluationDetails(flagDetails)
    }

    getFlag()
  }, [flagName, defaultValue, client])

  if (flagEvaluationDetails) {
    return flagEvaluationDetails.value
  } else {
    return defaultValue
  }
}

export function useStringFeatureFlag(
  flagName: string,
  defaultValue: string
): string {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<ResolutionDetails<string> | null>(null)

  const client = useOpenFeatureClient()

  useEffect(() => {
    async function getFlag() {
      const flagDetails = await client.getStringDetails(flagName, defaultValue)
      setFlagEvaluationDetails(flagDetails)
    }

    getFlag()
  }, [flagName, defaultValue, client])

  if (flagEvaluationDetails) {
    return flagEvaluationDetails.value
  } else {
    return defaultValue
  }
}
