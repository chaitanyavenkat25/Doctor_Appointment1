import { createContext, useContext, useEffect, useReducer } from "react";
import api from "../utils/api";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "UPDATE_USER":
      localStorage.setItem("user", JSON.stringify({ ...state.user, ...action.payload }));
      return { ...state, user: { ...state.user, ...action.payload } };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { user: null, token: null, loading: false };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const { data } = await api.post("/auth/login", credentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
    return data;
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  const updateUser = (updates) => dispatch({ type: "UPDATE_USER", payload: updates });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
