import {
  Client,
  EvaluationDetails,
  FlagValue,
  ResolutionDetails,
  ProviderEvents,
} from '@openfeature/js-sdk'
import { useCallback, useEffect, useState } from 'react'
import { useOpenFeatureClient } from './provider'

export function useFeatureFlag<T extends FlagValue>(
  flagKey: string,
  defaultValue: T
): T {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<ResolutionDetails<T> | null>(null)

  const client = useOpenFeatureClient()

  const refreshFlagState = useCallback(() => {
    getFlag(client, flagKey, defaultValue, setFlagEvaluationDetails)
  }, [client, flagKey, defaultValue, setFlagEvaluationDetails])

  useEffect(() => {
    client.addHandler(ProviderEvents.Ready, refreshFlagState)
    client.addHandler(ProviderEvents.ConfigurationChanged, refreshFlagState)

    return () => {
      // TODO: remove handler
    }
  }, [client, refreshFlagState])

  useEffect(refreshFlagState, [client, flagKey, defaultValue])

  if (flagEvaluationDetails) {
    return flagEvaluationDetails.value
  } else {
    return defaultValue
  }
}

async function getFlag<T extends FlagValue>(
  client: Client,
  flagKey: string,
  defaultValue: T,
  setFlagDetails: (details: EvaluationDetails<T>) => void
): Promise<void> {
  if (typeof defaultValue === 'boolean') {
    const flagDetails = await client.getBooleanDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else if (typeof defaultValue === 'string') {
    const flagDetails = await client.getStringDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else if (typeof defaultValue === 'number') {
    const flagDetails = await client.getNumberDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else {
    const flagDetails = await client.getObjectDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  }
}
