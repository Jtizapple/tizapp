import { AiOutlineMessage } from "react-icons/ai";

const Track = ({ track, chooseTrack, handleTriggerInfo }) => {
  const handleChooseTrack = () => {
    chooseTrack(track);
  };

  // Canciones
  return (
    <div className="track" onClick={handleChooseTrack}>
      <img src={track.albumUrl} alt={track.title} />
      <div className="description">
        <h1>{track.title}</h1>
        <p>{track.artist}</p>
        <AiOutlineMessage
          className="icon"
          onClick={handleChooseTrack}
          onClick={handleTriggerInfo}
        />
      </div>
    </div>
  );
};

export default Track;
