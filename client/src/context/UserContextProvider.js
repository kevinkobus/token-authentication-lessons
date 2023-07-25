import React, { useState, createContext } from "react"


const UserContext = createContext()

function UserContextProvider(props){
    const initState = { 
        user: {}, 
        token: "", 
        todos: [] 
    }

    const [userState, setUserState] = useState(initState)

    return (
        <UserContext.Provider
        value={{
            ...userState
        }}>
            { props.children }
        </UserContext.Provider>

    )
}




export { UserContextProvider, UserContext }