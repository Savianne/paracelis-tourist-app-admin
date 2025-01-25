"use client"
import styled from 'styled-components';
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';

interface AddressProps {
  initialCoords?: { lat: number; lng: number }; // Optional initial marker location
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
    lat: 17.15542311588796, // Default latitude
    lng: 121.493258879131, // Default longitude
};

const Location: React.FC<AddressProps> = ({ initialCoords }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Replace with your API key
  });

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    initialCoords || defaultCenter
  );
  const [address, setAddress] = useState<string | null>(null);

  if (!isLoaded) return <div>Loading...</div>;

  // Reverse Geocoding Function
  const reverseGeocode = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ location: { lat, lng } });
    if (result.results && result.results[0]) {
        console.log(result.results[0].formatted_address)
      return result.results[0].formatted_address;
    }
    return 'Address not found';
  };

  return (
    <>
      {markerPosition && (
        <AddressBox>
          <p><strong>Address:</strong> {address || 'Fetching address...'}</p>
        </AddressBox>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={markerPosition || defaultCenter}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </>
  );
};

const AddressBox = styled.div`
  display: flex;
  flex: 0 1 100%;
  padding: 20px;
  background-color: #a3e9e659;
  border-radius: 5px;
`
export default Location;
