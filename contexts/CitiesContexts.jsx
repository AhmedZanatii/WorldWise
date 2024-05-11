/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useCallback, useContext, useReducer } from "react";
import { useEffect, useState } from "react";

const cityContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "error":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}
function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const BASE_URL = "http://localhost:9000"; // Define the BASE_URL variable
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // const response = await fetch("data/cities.json"); // Use the BASE_URL variable
        const response = await fetch(`${BASE_URL}/cities`);

        const data = await response.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        alert("Error fetching cities");
        dispatch({ type: "error", payload: error.message });
      }
    }
    fetchCities();
  }, []);
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        // const response = await fetch("data/cities.json"); // Use the BASE_URL variable
        const data = await response.json();
        console.log(data);

        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        alert("Error fetching cities");
        dispatch({ type: "error", payload: error.message });
      }
    },
    [currentCity.id]
  );
  async function addCity(city) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const data = await response.json();
      dispatch({ type: "city/added", payload: data });
    } catch (error) {
      alert("Error on adding city");
      dispatch({ type: "error", payload: error.message });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      alert("Error on deleting city");
      dispatch({ type: "error", payload: error.message });
    }
  }
  return (
    <cityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </cityContext.Provider>
  );
}
function useCities() {
  const context = useContext(cityContext);
  if (context === undefined)
    throw new Error("CityContext was used outside of the CityProvider");
  return context;
}
// eslint-disable-next-line react-refresh/only-export-components
export { CityProvider, useCities };
