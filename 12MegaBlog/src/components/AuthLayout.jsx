// filepath: d:\Hitesh Sir(Chai aur code)\React PlayList\12MegaBlog\src\components\AuthLayout.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector(state => state.auth.status);

  useEffect(() => {
    // If authentication required but user not authenticated
    if (authentication === true && !authStatus) {
      navigate("/login");
    } 
    // If authentication not allowed and user is authenticated
    else if (authentication === false && authStatus) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}