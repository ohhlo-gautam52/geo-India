import { useEffect, useState } from "react";
import StreetView from "./Streetview";
import GuessPanel from "./GuessPanel";
import classes from "./Game.module.css";
import axios from "axios";
import { db } from "../../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import QPanel from "./QPanel";
import { maplist, guesslist } from "./lists";

// Firestore: update user score safely
const updateScore = async (room, username, score) => {
  try {
    const roomRef = doc(db, "rooms", room);
    const docSnap = await getDoc(roomRef);
    if (!docSnap.exists()) return;

    const users = docSnap.data().users || [];
    const userIndex = users.findIndex((u) => u.username === username);
    if (userIndex === -1) return;

    users[userIndex].score = score;
    await updateDoc(roomRef, { users });
  } catch (err) {
    console.error("Error updating score:", err);
  }
};

const Game = (props) => {
  // ✅ Load keys and URLs from environment
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const coordsUrl =
    process.env.REACT_APP_COORDS_URL ||
    "https://geo-india-b4df4-default-rtdb.asia-southeast1.firebasedatabase.app/coords.json";

  const [position, setPosition] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isStreetView] = useState(false); // removed unused setter to fix warning
  const [map, setMap] = useState("andhra17.gif");

  useEffect(() => {
    axios
      .get(coordsUrl)
      .then((response) => {
        const coords = response.data["-NlnTkcCgwJRFNCM2rLk"];
        if (coords && coords.length > 0) {
          const randomIndex = Math.floor(Math.random() * coords.length);
          setPosition(coords[randomIndex]);
        }
      })
      .catch((err) => console.error("Error fetching coords:", err));

    // update Firestore score
    if (props.room && props.username) {
      updateScore(props.room, props.username, props.score);
    }

    // set random map
    setMap(maplist[Math.floor(Math.random() * maplist.length)]);
  }, [props.score, props.room, props.username, coordsUrl]);

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const handleGuessSubmit = (userMarker) => {
    const distance = getDistance(
      userMarker.lat,
      userMarker.lng,
      position.lat,
      position.lng
    );

    if (distance < 1) props.handleScore(5000);
    else if (distance < 5) props.handleScore(4000);
    else if (distance < 10) props.handleScore(2000);
    else if (distance < 50) props.handleScore(1000);
    else props.handleScore(0);
  };

  return (
    <div className={classes.game_body}>
      {isStreetView ? (
        <StreetView apiKey={apiKey} position={position} />
      ) : (
        <QPanel map={map} />
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "40%" }}>
        <GuessPanel
          isStreetView={isStreetView}
          apiKey={apiKey}
          initialPosition={{ lat: 23.345386, lng: 80.426676 }}
          onGuessSubmit={handleGuessSubmit}
          guesslist={guesslist}
          map={map}
          handleScore={props.handleScore}
        />
      </div>
    </div>
  );
};

export default Game;
