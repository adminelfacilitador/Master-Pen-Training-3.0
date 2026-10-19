// Firebase Dual Service Architecture
// Coexistence of:
// 1. Master Pen Training Database (Ecosystem, Academy, Users & Content)
// 2. Michael Pen Universal Agent Database (Cross-ecosystem Memory & Agent Intelligence)

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, setLogLevel } from "firebase/firestore";

try {
  setLogLevel('silent');
} catch (e) {}

// ---------------------------------------------------------------------------
// 1. MASTER PEN TRAINING OFFICIAL EXTERNAL FIREBASE
// Project: master-pen-training
// Permanently connected to the external Cloud Firestore instance
// ---------------------------------------------------------------------------
const masterPenConfig = {
  apiKey: "AIzaSyDfMy-NfLvXbuFxopQw2DLxmTDVqYxCVk8",
  authDomain: "master-pen-training.firebaseapp.com",
  projectId: "master-pen-training",
  storageBucket: "master-pen-training.firebasestorage.app",
  messagingSenderId: "906552602305",
  appId: "1:906552602305:web:a4a0a74e3bb4d115626e40",
  measurementId: "G-R7NGDLB771"
};

const defaultApp: FirebaseApp = getApps().find(a => a.name === '[DEFAULT]') || initializeApp(masterPenConfig);
export const db: Firestore = getFirestore(defaultApp);
export const app = defaultApp;
export const firebaseConfig = masterPenConfig;

// ---------------------------------------------------------------------------
// 2. MICHAEL PEN UNIVERSAL AGENT OFFICIAL EXTERNAL FIREBASE
// Project: agente-universal-ecosistemas
// Dedicated memory, intelligence and avatar storage for Michael Pen
// ---------------------------------------------------------------------------
export const AGENT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA69oKeiC5jb_Ot3V4oPHDBkOjVEKs_-T4",
  authDomain: "agente-universal-ecosistemas.firebaseapp.com",
  projectId: "agente-universal-ecosistemas",
  storageBucket: "agente-universal-ecosistemas.firebasestorage.app",
  messagingSenderId: "23632332624",
  appId: "1:23632332624:web:12019f5a8f76e81b058e55",
  measurementId: "G-FLY8NNTHYK"
};

export const agentApp: FirebaseApp = getApps().find(a => a.name === 'michael-pen-agent') || initializeApp(AGENT_FIREBASE_CONFIG, 'michael-pen-agent');
export const agentDb: Firestore = getFirestore(agentApp);
