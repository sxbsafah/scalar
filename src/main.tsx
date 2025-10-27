import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router';
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { shadcn } from "@clerk/themes"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const Router = import.meta.env.DEV ? BrowserRouter : HashRouter;


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signUpUrl="/sign-up"
        signInUrl="/sign-in"
        afterSignOutUrl={"/sign-in"}
        appearance={{
          theme: shadcn
        }}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </Router>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})

