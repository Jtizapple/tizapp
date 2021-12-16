import { useState, useEffect } from "react";
import axios from "axios";

//Metodo para obtener token para cada peticion al API
const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState();
  /*const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();*/

  useEffect(() => {
    //Envia peticon a servidor para obtener token
    axios
      .post("http://localhost:8888/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        /*setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);*/
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  return accessToken;
};

export default useAuth;
