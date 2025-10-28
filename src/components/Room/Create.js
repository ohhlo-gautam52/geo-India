import classes from "./Create.module.css";
import { useState } from "react";
import { db } from "../../firebase";
import { setDoc, Timestamp, getDoc, doc } from "firebase/firestore";

const CreateRoom = (props) => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomName = e.target["room-name"].value;
    const roomPassword = e.target["room-password"].value;
    if (roomName.trim() === "" || roomPassword.trim() === "") {
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    const roomRef = doc(db, "rooms", roomName);
    const docSnap = await getDoc(roomRef);
    if (docSnap.exists()) {
      setError("Room already exists");
      return;
    }

    try {
      const doc = await setDoc(
        roomRef,
        {
          name: roomName,
          password: roomPassword,
          users: [{ username: props.username, score: 0 }],
          createdAt: Timestamp.now(),
        },
        { merge: true }
      );
      console.log("Document written with ID: ", doc.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    props.handleRoom(roomName);
    localStorage.setItem("room", roomName);
    props.changePage("dashboard");
  };

  return (
    <div className={classes.room}>
      <h1>Create Room</h1>
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="room-name">Room Name</label>
        <input type="text" name="room-name" id="room-name" />
        <label htmlFor="room-password">Room Password</label>
        <input type="password" name="room-password" id="room-password" />
        {error && <p className={classes.error}>{error}</p>}
        <button>Create</button>
      </form>
    </div>
  );
};

export default CreateRoom;
