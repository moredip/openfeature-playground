export const LOCATIONS = [
  {
    id: 'san-francisco',
    label: 'San Francisco',
  },
  {
    id: 'seattle',
    label: 'Seattle',
  },
  {
    id: 'boston',
    label: 'Boston',
  },
]

export function getLocationInfo(locationId){
  return LOCATIONS.find((l)=>l.id === locationId)
}

export function allLocations(currentLocationId){
  return LOCATIONS.map( (location)=>{
    const isCurrent = location.id === currentLocationId
    return {
      ...location,
      isCurrent 
    }
  })
}
