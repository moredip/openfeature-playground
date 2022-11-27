
export function getTemperature(locationId){
  switch(locationId){
    case 'san-francisco':
      return 62
    case 'seattle':
      return 51
    case 'boston':
      return 33
  }
}

export function getConditions(locationId){
  switch(locationId){
    case 'san-francisco':
      return 'foggy'
    case 'seattle':
      return 'drizzle'
    case 'boston':
      return 'clear'
  }
}

export async function getUmbrellaPrediction(locationId){
  switch(locationId){
    case 'san-francisco':
      return false;
    case 'seattle':
      return true;
    case 'boston':
      return false;
  }
}
