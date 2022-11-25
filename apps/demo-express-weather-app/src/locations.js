export const LOCATIONS = [
  {
    slug: 'san-francisco',
    label: 'San Francisco',
    temperatureF: 62
  },
  {
    slug: 'seattle',
    label: 'Seattle',
    temperatureF: 52
  },
  {
    slug: 'boston',
    label: 'Boston',
    temperatureF: 33
  },
]

export function locationBySlug(slug){
  return LOCATIONS.find((l)=>l.slug === slug)
}

export function allLocations(currentSlug){
  return LOCATIONS.map( (location)=>{
    const isCurrent = location.slug === currentSlug
    return {
      ...location,
      isCurrent 
    }
  })
}
