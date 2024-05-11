/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import BackButton from "./BackButton";

import styles from "./Form.module.css";
import { useNavigate } from "react-router";
import { useLocation } from "../hooks/useLocation";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContexts";

// eslint-disable-next-line react-refresh/only-export-components
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const flagEmojiToPNG = (flag) => {
  // if (typeof flag !== "string" || flag.length === 0) {
  //   console.log("flag is not a string or is empty");
  //   return null; // or some other value to indicate an error or empty input
  // }
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

function Form() {
  const [Lat, Lng] = useLocation();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const { addCity, isLoading } = useCities();
  useEffect(() => {
    async function fetchCountry() {
      if (!Lat && !Lng) return;
      try {
        setErrorCode("");
        setIsGeoLoading(true);
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${Lat}&longitude=${Lng}`
        );
        const data = await response.json();
        if (!data.countryCode) throw new Error("Country not found");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setErrorCode(error.message);
      } finally {
        setIsGeoLoading(false);
      }
    }
    fetchCountry();
  }, [Lat, Lng, setCountry, setEmoji, setCityName]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat: Lat, lng: Lng },
      emoji,
    };
    await addCity(newCity);
    navigate("/app/cities");
  }
  if (isGeoLoading) return <Spinner />;
  if (errorCode) return <Message message={errorCode} type="error" />;
  if (!Lat && !Lng)
    return <Message message="Start with click somewhere on the map" />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{flagEmojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        />
      </div>
    </form>
  );
}

export default Form;
