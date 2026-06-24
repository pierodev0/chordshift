# Firebase Auth + Vercel

## Problem

Google login (`signInWithRedirect`) fails on Vercel with:

```
Error 400: redirect_uri_mismatch
redirect_uri=https://<vercel-domain>/__/auth/handler
```

Works on localhost but not on production.

## Root Cause

Firebase Auth v12+ builds the OAuth `redirect_uri` using the **current page origin** (`window.location.origin + /__/auth/handler`), ignoring the `authDomain` in the Firebase config.

When hosted on Vercel (`chordshift-tawny.vercel.app`), the redirect URI becomes `https://chordshift-tawny.vercel.app/__/auth/handler`, but the Google Cloud OAuth client only has `https://chordshift-8dce2.firebaseapp.com/__/auth/handler` registered.

## Fix

In Google Cloud Console → APIs & Services → Credentials → Edit the "Web client (auto created by Google Service)" OAuth 2.0 Client ID:

| Field | Value |
|-------|-------|
| Authorized JavaScript origins | `https://chordshift-tawny.vercel.app` |
| Authorized redirect URIs | `https://chordshift-tawny.vercel.app/__/auth/handler` |

Wait ~5 minutes for Google to propagate.

### If adding a new deployment domain

Repeat the same two additions for each new domain (e.g., preview deployments, custom domains).

## Why practice-timer-v2 worked

The `music-routine-app` Firebase project already had its Vercel domain configured in the OAuth client. The auth code is identical.

## Code

No code changes needed. The current strategy in `src/firebase/auth.js`:

1. Try `signInWithPopup`
2. If `auth/popup-blocked`, fallback to `signInWithRedirect`
3. On page load, `handleRedirectResult()` captures the result

The `vercel.json` proxy approach (Option 3 from Firebase docs) was tested but is unnecessary — the OAuth client config alone fixes it.
