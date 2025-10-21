import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MainContextProvider from './datas/MainContext.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import CharacterContextProvider from './datas/CharacterContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CharacterContextProvider>
    <MainContextProvider>
      <App />
      <Toaster richColors></Toaster>
    </MainContextProvider>
    </CharacterContextProvider>
  </StrictMode>,
)
