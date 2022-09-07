import React, { useEffect, useState } from "react";
import firebaseapi from "../../utils/firebaseapi";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDoc,
  getDocs,
  getFirestore,
  deleteDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

const ChatList = () => {
  const db = getFirestore();
  const [getUser, setGetUser] = useState("");
  const [friendList, setFriendList] = useState<any>();

  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    console.log(userId);
    if (userId) {
      setGetUser(userId);
      firebaseapi.readUserData(userId).then((result) => {
        if (result) {
          console.log(result["friend_list"]);
          setFriendList(result["friend_list"]);
        }
      });
    }
    const chatRef = collection(db, "Chatrooms");
    const q = query(chatRef, where("user_id", "==", userId));
  }, []);

  return (
    <>
      <p>Here to display all merged: Friend_list and open repo (chatroom)</p>
      <h1>Friend list</h1>
      {friendList &&
        friendList.map((friend: any) => {
          return (
            <div>
              {friend["user_name"]} - {friend["user_id"]}
            </div>
          );
        })}
      <h1>Repo (Chatroom list)</h1>
    </>
  );
};

export default ChatList;
