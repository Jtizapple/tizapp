import { useState, useEffect } from "react";
/* Libreria para API de Spotify */
import SpotifyWebApi from "spotify-web-api-node";
/* Icons */
import { AiOutlineCaretRight } from "react-icons/ai";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { FaSpotify } from "react-icons/fa";
import { BiError } from "react-icons/bi";
/* Componentes */
import Track from "./Track";
/* Token */
import useAuth from "./useAuth";

/* Client id para Spotify */
const spotifyApi = new SpotifyWebApi({
  clientId: "89c04bf558a144b4bd1d830ea63831b6",
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState(""); //Value que se encuentra en el input de canciones
  const [searchResults, setSearchResults] = useState([]); //Datos provenientes del API de Spotify
  const [selectedTrack, setSelectedTrack] = useState({}); //Almacena URI de cancion seleccionada
  const [showMoreInfo, setShowMoreInfo] = useState(false); //Trigger para mostrar detalles de canciones
  const [pageNumber, setPageNumber] = useState(0); //Almacena numero de paginas
  const [fakePageNumber, setFakePageNumber] = useState(0); //Numero de pagina falso

  const tracksPerPage = 8; //Numero de canciones que se despliegan por pagina
  const pagesVisited = pageNumber * tracksPerPage; //Control de paginas

  const pageCount = Math.ceil(searchResults.length / tracksPerPage); //Paginas totales

  // Metodo para cambio a la siguiente pagina
  const nextPage = () => {
    if (pageNumber >= 0 && pageNumber < pageCount - 1) {
      setPageNumber(pageNumber + 1);
      setFakePageNumber(fakePageNumber + 1);
    }
  };

  // Metodo para cambio a la pagina anterior
  const pervPage = () => {
    if (pageNumber < pageCount && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      setFakePageNumber(fakePageNumber - 1);
    }
  };

  //Guarda los datos de la cancion seleccionada
  const chooseTrack = (track) => {
    setSelectedTrack(track);
  };

  //Muesta/oculta detalles de la cancion
  const triggerInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  useEffect(() => {
    if (accessToken) {
      return;
    }
  }, [showMoreInfo]);

  useEffect(() => {
    if (pageCount == 0) {
      setFakePageNumber(0);
    } else {
      setFakePageNumber(pageNumber + 1);
    }
  }, [pageCount]);

  //Establece el token para usar en API de Spotify
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    setPageNumber(0);
    if (!search) return setSearchResults([]);
    if (!accessToken) return; //verifica que el token no este expirado o inexistente
    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      //consulta de canciones
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            //metodo para seleccionar imagen mas paqueña
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            album: track.album.name,
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
            playLink: track.external_urls.spotify,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  //Metodo para mostrar mensaje de Error o logo de Spotify cuando no se encuentran canciones.
  const setMessage = () => {
    if (search.length > 0 && searchResults.length == 0) {
      return (
        <div className="message">
          <BiError className="errorIcon" /> No se encuentran resultados...
        </div>
      );
    }
    if (search == 0) {
      return (
        <div className="message">
          <FaSpotify className="messageIcon" />
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboardContainer">
        <div className="typingArea">
          <h1>
            Tizapp <FaSpotify className="titleIcon" />
          </h1>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cancion/Artista/Letra"
          />
        </div>
        <div className="trackList">
          <div className="traks">
            <div className="content">
              {setMessage() /*despliega mensaje de alerta si es necesario*/}
              {searchResults /* Muestra caniones consultadas */
                .slice(pagesVisited, pagesVisited + tracksPerPage)
                .map((track) => {
                  return (
                    <Track
                      track={track}
                      key={track.uri}
                      chooseTrack={chooseTrack}
                      handleTriggerInfo={triggerInfo}
                    />
                  );
                })}
            </div>
            <div className="pagination">
              <AiOutlineCaretLeft /* Botones para pagiancion */
                onClick={pervPage}
                className="paginationIcon"
              />
              <h1>
                {fakePageNumber} - {pageCount}
              </h1>
              <AiOutlineCaretRight
                onClick={nextPage}
                className="paginationIcon"
              />
            </div>
          </div>
          <div
            className={
              showMoreInfo
                ? "closeShow"
                : "closeHide" /* Ventana para detalles de canciones */
            }
            onClick={triggerInfo}
          ></div>
          <div className={showMoreInfo ? "detailsShow" : "detailsHide"}>
            <div className="trackDetails">
              <img src={selectedTrack.albumUrl} />
              <h1>{selectedTrack.title}</h1>
              <h2>{selectedTrack.album}</h2>
              <p>{selectedTrack.artist}</p>
              <a href={selectedTrack.playLink} target="_blank" rel="noopener">
                Escuchar en Spotify
                <FaSpotify className="spIcon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
