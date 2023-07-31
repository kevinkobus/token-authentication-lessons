import React, { useState, createContext } from "react";
import axios from "axios";

const UserContext = createContext();

// Creating another version of axios to intercept user token so it gets passed with the authorization header
const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Context provider for user signup/login and authentication
function UserContextProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    todos: [],
  };

  // Set state for user's info and set initState from above as default
  const [userState, setUserState] = useState(initState);

  // User signup
  function signup(credentials) {
    axios
      .post("/auth/signup", credentials)
      .then((res) => {
        const { user, token } = res.data;
        localStorage.setItem("token", token); //saving the token data to localStorage so not to lose it after browser refresh
        localStorage.setItem("user", JSON.stringify(user)); //saving the user data to localStorage so not to lose it after browser refresh
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }));
      })
      // .catch(err => console.dir(err))
      .catch((err) => console.log(err.response.data.errMsg));
  }
  // User login
  function login(credentials) {
    axios
      .post("/auth/login", credentials)
      .then((res) => {
        const { user, token } = res.data;
        localStorage.setItem("token", token); //saving the token data to localStorage so not to lose it after browser refresh
        localStorage.setItem("user", JSON.stringify(user)); //saving the user data to localStorage so not to lose it after browser refresh
        getUserTodos();
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }));
      })
      // .catch(err => console.dir(err))
      .catch((err) => console.log(err.response.data.errMsg));
  }

  // User logout which removes user info from localStorage and resets state
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState({
      user: {},
      token: "",
      todos: [],
    });
  }

  function getUserTodos() {
    userAxios
      .get("/api/todo/user")
      .then((res) => {
        setUserState((prevState) => ({
          ...prevState,
          todos: [...prevState.todos, res.data],
        }));
      })
      .catch((err) => console.log(err.response.data.errMsg));
  }

  function addTodo(newTodo) {
    userAxios
      .post("/api/todo", newTodo)
      .then((res) => {
        setUserState((prevState) => ({
          ...prevState,
          todos: [...prevState.todos, res.data],
        }));
      })
      .catch((err) => console.log(err.response.data.errMsg));
  }

  //   returning/providing the userState and other values to be consumed by any component that imports them
  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        addTodo,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
