/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router";
import styles from "./City.module.css";
import { useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContexts";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));
const flagemojiToPNG = (flag) => {
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
function City() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCities();
  const { cityName, emoji, date, notes } = currentCity;
  useEffect(() => {
    getCity(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getCity]);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji ? flagemojiToPNG(emoji) : null}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <BackButton
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
}

export default City;
