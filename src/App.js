import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  
  apiKey: "AIzaSyDPkLLV6SZhpNstkXlRCvbpDYbZHhEgtRY",
  authDomain: "coolchatapp-7488f.firebaseapp.com",
  projectId: "coolchatapp-7488f",
  storageBucket: "coolchatapp-7488f.appspot.com",
  messagingSenderId: "470706481158",
  appId: "1:470706481158:web:f518a8dc5923826b0dbb87",
  measurementId: "G-QLMSQSJZCT"


})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
     

      <section>

        {user ? <ChatRoom /> : <SignIn />}
        
      </section>
      
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    
    <button className="sign-in" onClick={signInWithGoogle}> Sign In With Google </button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(100)

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    
    <main>
  <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      </div>
    </main>

    <div>
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Drop A Message! 😁  " />

        <button type="submit" disabled={!formValue}>✉️</button>


        <SignOut />

      </form>
   </div>
    
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="google avi" />
      <p>{text}</p>
    </div>
  </>)
}
export default App;
