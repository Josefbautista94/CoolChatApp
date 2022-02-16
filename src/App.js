import React, { useState } from 'react';
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
      <header className="App-header">
        
      </header>

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
    
    <button onClick={signInWithGoogle}> Sign In With Google </button>
  )
}

function signOut() {
  return auth.currentUser && (
    <button onClick = { () => auth.signOut()}> Sign Out </button>
  )
}

function ChatRoom() {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' })
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
  }
  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message= {msg}/>)}
      </div>

      <form onSubmit = {sendMessage}>
        
        <input value = {formValue} onChannge ={(e) => setFormValue(e.target.value)} />

        <button type = "submit"> 👍 </button>
         
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid,photoURL } = props.meesage;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src = {photoURL}/>
    <p> {text} </p>
    </div>
    )
}

export default App;
