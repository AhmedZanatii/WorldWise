/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";
const Authcontext = createContext();
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const initialState = { isAuthenticated: false, user: null };
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };

    case "logout":
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error("Unknown action");
  }
}
function AuthProvider({ children }) {
  const [{ isAuthenticated, user }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <Authcontext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
}
function useAuth() {
  const context = useContext(Authcontext);
  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");
  return context;
}
export { AuthProvider, useAuth };
