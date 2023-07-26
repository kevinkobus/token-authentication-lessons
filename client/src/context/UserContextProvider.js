import React, { useState, createContext } from "react"
import axios from "axios"


const UserContext = createContext()

function UserContextProvider(props){
    const initState = { 
        user: {}, 
        token: "", 
        todos: [] 
    }

    const [userState, setUserState] = useState(initState)

    function signup(credentials){
        axios.post("/auth/signup", credentials)
        .then(res => console.log(res))
        // .catch(err => console.dir(err))
        .catch(err => console.log(err.response.data.errMsg))
    }

    function login(credentials) {
        axios.post("/auth/login", credentials)
        .then(res => console.log(res))
        // .catch(err => console.dir(err))
        .catch(err => console.log(err.response.data.errMsg))
    }



    return (
        <UserContext.Provider
        value={{
            ...userState,
            signup,
            login
        }}>
            { props.children }
        </UserContext.Provider>

    )
}




export { UserContextProvider, UserContext }