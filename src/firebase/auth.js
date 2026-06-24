import { ref } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config.js'

const provider = new GoogleAuthProvider()
export const user = ref(null)

export async function loginGoogle() {
  const result = await signInWithPopup(auth, provider)
  return result
}

export async function handleRedirectResult() {
  try {
    return await getRedirectResult(auth)
  } catch (err) {
    console.error('Redirect result error:', err)
    return null
  }
}

export async function logoutGoogle() {
  return signOut(auth)
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, (u) => {
    user.value = u
    callback(u)
  })
}
