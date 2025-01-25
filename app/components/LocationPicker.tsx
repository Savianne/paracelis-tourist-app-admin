"use client"
import styled from 'styled-components';
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';

interface AddressPickerProps {
  initialCoords?: { lat: number; lng: number }; // Optional initial marker location
  onLocationSelect: (coords: { lat: number; lng: number, address?: string }) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
    lat: 17.15542311588796, // Default latitude
    lng: 121.493258879131, // Default longitude
};

const AddressPicker: React.FC<AddressPickerProps> = ({ initialCoords, onLocationSelect }) => {
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

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });

      // const locationAddress = await reverseGeocode(lat, lng); // Get address
      // setAddress(locationAddress);

      onLocationSelect({ lat, lng }); // Pass coordinates and address to parent
    }
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
        onClick={handleMapClick}
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
export default AddressPicker;
