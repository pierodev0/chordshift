import { ref } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config.js'

const provider = new GoogleAuthProvider()
export const user = ref(null)

export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    return result
  } catch (err) {
    if (err.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider)
      return null
    }
    throw err
  }
}

export async function handleRedirectResult(timeoutMs = 5000) {
  try {
    const result = await Promise.race([
      getRedirectResult(auth),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ])
    return result
  } catch (err) {
    if (err.message === 'timeout') {
      console.warn('handleRedirectResult timed out after ' + timeoutMs + 'ms')
      return null
    }
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
