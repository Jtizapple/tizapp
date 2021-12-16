require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
/* Se usa la libreria "spotify-web-api-node" contiene metodos que permiten interactuar
  con el API de Spotify de formas mas sencilla*/

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Credenciales necesarias para establecer conexion con el API de Spotify */
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/* Metodo para solicitar token al API de Spotify 
(Es necesario para hacer cualquier petciones a la API)*/
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: REDIRECT_URI,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.listen(8888, () => {
  console.log("App running!");
});
