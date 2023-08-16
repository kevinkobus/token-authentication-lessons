import React from "react"
import { Navigate } from "react-router-dom"

function ProtectedRoute(props){
    const { token, redirectTo, children } = props
// if the there is a token, render the component that is being passed in, otherwise navigate to "/"
return token ? children : <Navigate to={redirectTo} />  

}

export default ProtectedRoute

    // <ProtectedRoute>
        // <Component/> // access through React.children
    // </ProtectedRoute>