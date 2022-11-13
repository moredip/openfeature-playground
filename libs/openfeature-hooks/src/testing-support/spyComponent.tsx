import { useBooleanFeatureFlag } from '../lib/useFlag'

type FlagType = boolean

type Spy = {
  SpyComponent: React.ComponentType
  getFlagEvalHistory: () => FlagType[]
}

export function createSpy(
  flagToSpyOn: string,
  defaultFlagValue: FlagType
): Spy {
  const flagHistory: FlagType[] = []
  function handleRender(currentFlagValue: FlagType) {
    flagHistory.push(currentFlagValue)
  }

  function SpyComponent() {
    const flagValue = useBooleanFeatureFlag(flagToSpyOn, defaultFlagValue)
    handleRender(flagValue)

    return <p>I am spying on the state of the '{flagToSpyOn}' feature flag</p>
  }

  function getFlagEvalHistory() {
    return flagHistory
  }

  return {
    SpyComponent,
    getFlagEvalHistory,
  }
}
