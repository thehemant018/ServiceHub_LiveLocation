import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [distance, setDistance] = useState(null);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [userAddress, setUserAddress] = useState();
  const [customerAddress, setCustomerAddress] = useState();
  const [customerName, setCustomerName] = useState();
  const [selectedOption, setSelectedOption] = useState('');
  const geo = navigator.geolocation;

  useEffect(() => {
    // Get User current location
    geo.getCurrentPosition(userCoords);
    async function userCoords(position) {
      let userLatitude = position.coords.latitude;
      let userLongitude = position.coords.longitude;
      setLatitude(userLatitude);
      setLongitude(userLongitude);

      // After setting the latitude and longitude, get the user address
      await getUserAddress();
    }
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    // ... (same as your existing getDistance function, without the asynchronous calls)
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
  // const getUserAddress = async () => {
  //   try {
  //     let url = `https://api.opencagedata.com/geocode/v1/json?key=aab7d26cfc134dbcb3e15f855e0668b3&q=${latitude}%2C+${longitude}&pretty=1&no_annotations=1`;
  //     const loc = await fetch(url);
  //     const data = await loc.json();
  
  //     if (data.results && data.results.length > 0) {
  //       console.log("User Country:", data.results[0].components.country);
  //       setUserAddress(data.results[0].formatted);
  //     } else {
  //       console.log("No results found for user address");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user address:", error);
  //   }
  // };

  const getUserAddress = async () => {
    try {
      if (latitude === undefined || longitude === undefined) {
        console.log("Latitude or longitude is undefined. Unable to fetch user address.");
        return;
      }
  
      let url = `https://api.opencagedata.com/geocode/v1/json?key=aab7d26cfc134dbcb3e15f855e0668b3&q=${latitude}%2C+${longitude}&pretty=1&no_annotations=1`;
      const loc = await fetch(url);
      const data = await loc.json();
  
      if (data.results && data.results.length > 0) {
        console.log("User Country:", data.results[0].components.country);
        setUserAddress(data.results[0].formatted);
      } else {
        console.log("No results found for user address");
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };
  
  const getCustomerAddress = async (clatitude, clongitude) => {
    try {
      let url = `https://api.opencagedata.com/geocode/v1/json?key=aab7d26cfc134dbcb3e15f855e0668b3&q=${clatitude}%2C+${clongitude}&pretty=1&no_annotations=1`;
      const loc = await fetch(url);
      const data = await loc.json();
      // console.log("User Country:", data.results[0].components.country);
      setCustomerAddress(data.results[0].formatted);
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  const getFinalDistance = (customer) => {
    const user = { ulatitude: latitude, ulongitude: longitude };
    const finaldistance = getDistance(
      user.ulatitude,
      user.ulongitude,
      customer.clatitude,
      customer.clongitude
    );
    return finaldistance;
  };



  const findNearestCustomer = () => {

    const customers = [
      { name: "Hemant", clatitude: 22.5201824, clongitude: 72.9166421, category: "plumber" },
      { name: "Darshit", clatitude: 22.5202663, clongitude: 72.9165708, category: "pest" },
      { name: "Adarsh", clatitude: 22.521073, clongitude: 72.9169385, category: "carpenter" },
      { name: "Jay", clatitude: 22.5206178, clongitude: 72.9167153, category: "electrician" },
    ];

    const selectedCategoryCustomers = customers.filter(
      (customer) => customer.category === selectedOption
    );

    if (selectedCategoryCustomers.length === 0) {
      console.log('No customers found for the selected category');
      return null;
    }

    let nearestCustomer = null;
    let minDistance = Infinity;
    let nearestCustomerIndex = -1;

    selectedCategoryCustomers.forEach((customer, index) => {
      const customerDistance = getFinalDistance(customer);
      if (customerDistance < minDistance) {
        minDistance = customerDistance;
        nearestCustomer = customer;
        nearestCustomerIndex = index;
      }
    });

    getCustomerAddress(
      selectedCategoryCustomers[nearestCustomerIndex].clatitude,
      selectedCategoryCustomers[nearestCustomerIndex].clongitude
    );

    setCustomerName(selectedCategoryCustomers[nearestCustomerIndex].name);
    setDistance(minDistance);

    return nearestCustomer;
  };

  const handleGetUserAddress = async () => {
    await getUserAddress();
  };


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFindNearestCustomer = () => {
    const nearestCustomer = findNearestCustomer();
    console.log("Nearest customer:", nearestCustomer);
  };

  return (
    <>
      <div>
        <h1>Current Location</h1>
        <h3>Latitude: {latitude}</h3>
        <h3>Longitude: {longitude}</h3>
        <h3>User Address: {userAddress}</h3>
        <h3>Customer Address: {customerAddress}</h3>
        <h3>Customer Name: {customerName}</h3>
        {distance !== null && (
          <p>
            The distance between You and the nearest customer is: ( {distance.toFixed(2)} ) kilometers
          </p>
        )}
        <button onClick={handleGetUserAddress} style={{ marginRight: "20px" }}>
          Get User Address
        </button>
        {/* <button onClick={handleFindNearestCustomer}>Find Nearest Customer</button> */}

        <br />
        <br />
        {/* ... (your existing JSX) */}
        <label htmlFor="servicesCategory">Select Services Category:</label>
        <select id="servicesCategory" value={selectedOption} onChange={handleOptionChange}>
          <option value="plumber">Plumber</option>
          <option value="pest">Pest Control</option>
          <option value="carpenter">Carpenter</option>
          <option value="electrician">Electrician</option>
          {/* Add more options as needed */}
        </select>

        <p>Selected Option: {selectedOption}</p>

        <button
          onClick={() => {
            if (selectedOption) {
              handleFindNearestCustomer();
            } else {
              console.log('No idea');
            }
          }}
          style={{ marginRight: "20px" }}
        >
          {selectedOption ? 'Find Nearest Customer' : 'Select a Category'}
        </button>
        {/* ... (your existing JSX) */}
      </div>
    </>
  );
}

export default App;
