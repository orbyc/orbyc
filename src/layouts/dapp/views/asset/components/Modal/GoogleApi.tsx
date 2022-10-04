const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY  || ''

export const getCoordinates = async (city: string): Promise<any> => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleApiKey}`);
    return await response.json();
}