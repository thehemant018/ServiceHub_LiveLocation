import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [distance, setDistance] = useState(null);
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [userAddress, setUserAddress] = useState()
  const geo = navigator.geolocation

  useEffect(() => {
    //Get User current location
    geo.getCurrentPosition(userCoords)
    function userCoords(position) {
      let userLatitude = position.coords.latitude
      let userLongitude = position.coords.longitude
      // console.log('Latitude',userLatitude);
      // console.log('Longitude:', userLongitude);
      setLatitude(userLatitude);
      setLongitude(userLongitude);
    }

    // useEffect(() => {
   
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;

    // Calculate the differences in coordinates
    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;

    // Haversine formula to calculate distance
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Earth radius in kilometers (you can adjust this value)
    const earthRadius = 6371;

    // Calculate the distance
    const calculatedDistance = earthRadius * c;
    return calculatedDistance;
  };

  const getFinalDistance=()=>{
    const user = { ulatitude: latitude, ulongitude: longitude };
    const customer = { clatitude: 22.5206043, clongitude: 72.9162908 };

    const finaldistance = getDistance(user.ulatitude, user.ulongitude, customer.clatitude, customer.clongitude);
    setDistance(finaldistance)
  }

  const getUserAddress = async () => {
    let url = `https://api.opencagedata.com/geocode/v1/json?key=aab7d26cfc134dbcb3e15f855e0668b3&q=${latitude}%2C+${longitude}&pretty=1&no_annotations=1`;
    const loc = await fetch(url);
    const data = await loc.json()
    // console.log("User address :",data);
    // console.log("User City :",data.results[0].components.city);
    console.log("User Country :", data.results[0].components.country);
    setUserAddress(data.results[0].formatted)
  }

  const handleGetUserAddress = () => {
    getUserAddress()
  }

  return (
    <>
      <div>
        <h1>Current Location</h1>
        <h3>Latitude : {latitude}</h3>
        <h3>Longitude : {longitude}</h3>
        <h3>User Address: {userAddress}</h3>
        {distance !== null && (
          <p>The distance between You and MARCOS is : ( {distance.toFixed(2)} )kilometers</p>
          // <p>Distance between point1 and point2: ( {distance} )kilometers</p>
        )}
        <button onClick={handleGetUserAddress} style={{marginRight:"20px"}}>Get User Address</button>
        <button onClick={getFinalDistance}>Get Distance</button>
      </div>
    </>
  );
}

export default App;
