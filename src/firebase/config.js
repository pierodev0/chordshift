import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC2qq6Ctf2X_bOlqXdSb1Sz82JhW-VFayM",
  authDomain: "chordshift-8dce2.firebaseapp.com",
  projectId: "chordshift-8dce2",
  storageBucket: "chordshift-8dce2.firebasestorage.app",
  messagingSenderId: "440481801297",
  appId: "1:440481801297:web:354315f92ebdc194be4470"
}

export const app = initializeApp(firebaseConfig)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
export const auth = getAuth(app)
