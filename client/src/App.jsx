import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";

/* Se obtiene codigo de para solicitud de token, para ser enviado al dashboard.
Este codigo es enviado desde el componente "Login", que se encarga de hacer 
la peticion al API de Spotify*/
const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  return code ? <Dashboard code={code} /> : <Login />;
};

export default App;
