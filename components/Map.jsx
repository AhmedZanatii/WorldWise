/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useLocation } from "../hooks/useLocation";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContexts";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([60, 104]);
  const {
    isloading: isLoadingLocation,
    position: geoLocation,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useLocation();
  const flagEmojiToPNG = (flag) => {
    if (typeof flag !== "string" || flag.length === 0) {
      console.log("flag is not a string or is empty");
      return null; // or some other value to indicate an error or empty input
    }
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join("");
    return (
      <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
  };
  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);
  useEffect(() => {
    if (geoLocation) {
      setMapPosition([geoLocation.lat, geoLocation.lng]);
    }
  }, [geoLocation, setMapPosition]);
  return (
    <div className={styles.mapContainer}>
      {!geoLocation && (
        <Button onClick={getPosition} type="position">
          {isLoadingLocation ? "Loading..." : "Use current location"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{flagEmojiToPNG(city.emoji)}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <CenterChange position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}
function CenterChange({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
