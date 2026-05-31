// Entry point for the React app; mounts the root component to the DOM.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './shared/styles/index.css'
import './shared/i18n'
import App from './App'
import { ErrorBoundary } from './shared/ui/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)

