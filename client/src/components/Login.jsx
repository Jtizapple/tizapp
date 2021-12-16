import { FaSpotify } from "react-icons/fa";

/* Se envian los parametros necesarios para auteticar usuario en el API de Spotify
esto retorna un codigo de acceso, que será recibido en app principal */
const Login = () => {
  const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=89c04bf558a144b4bd1d830ea63831b6&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

  return (
    <div className="login">
      <h1>
        Tizapp <FaSpotify className="loginTitleIcon" />
      </h1>
      <a href={AUTH_URL}>
        Inicia sesión en Spotify
        <FaSpotify className="loginIcon" />
      </a>
    </div>
  );
};

export default Login;
