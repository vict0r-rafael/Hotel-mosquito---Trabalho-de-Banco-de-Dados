import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'jotai'
import { SWRConfig } from 'swr'
import { fetcher } from './lib/fetcher'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <SWRConfig value={{ fetcher }}>
        <App />
      </SWRConfig>
    </Provider>
  </StrictMode>,
)
