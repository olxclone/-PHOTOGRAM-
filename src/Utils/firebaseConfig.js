import fire from 'firebase';
export const firebaseConfig = {
  apiKey: 'AIzaSyCpu15gLj26DvOR6rES93CXR_G-yYUat4E',
  authDomain: 'olxclone-3137d.firebaseapp.com',
  databaseURL: 'https://olxclone-3137d-default-rtdb.firebaseio.com',
  projectId: 'olxclone-3137d',
  storageBucket: 'olxclone-3137d.appspot.com',
  messagingSenderId: '1095734728208',
  appId: '1:1095734728208:web:b2b6884193369e4d051c95',
  measurementId: 'G-1MXCD8JEKY',
};

let Firebase = fire.initializeApp(firebaseConfig);
export default Firebase;
