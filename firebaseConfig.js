var firebaseConfig = {
    apiKey: "AIzaSyDd2Pv7qRY6QLQEVF2fuwmK4QESCBbOZDw",
    authDomain: "kinnect-3124b.firebaseapp.com",
    databaseURL: "https://kinnect-3124b.firebaseio.com",
    projectId: "kinnect-3124b",
    storageBucket: "kinnect-3124b.appspot.com",
    messagingSenderId: "165556513716",
    appId: "1:165556513716:web:26d82c6aec3824b7e3a0e1",
    measurementId: "G-HMKHBVK45S"
  };


  import firebase from 'firebase';
  import 'firebase/firestore';
  
  class Fire {
      constructor() {
          firebase.initializeApp(firebaseConfig);
          this.observeAuth();
      }
  
      observeAuth = () => {
          firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
      }
  
      onAuthStateChanged = user => {
          if (!user) {
              try {
                  firebase.auth().signInAnonymously();
              } catch ({ message }) {
                  console.log(message);
              }
          }
      }
  
      // Used for firestore
      getCollection = (collection) => {
          return firebase.firestore().collection(collection);
      }
  
      // Used for realtime database
      getRef = (reference) => {
          return firebase.database().ref(reference);
      }
  
      off() {
          this.ref.off();
      }
  
     // async logEvent(eventName, properties) {
          //await Analytics.logEvent(eventName, properties);
      //}
  
     // async logScreen(screenName) {
         // await Analytics.setCurrentScreen(screenName);
     // }
  }
  
  Fire.db = new Fire();
  export default Fire;