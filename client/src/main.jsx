import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// to bring back the "Something went wrong" error screen:
//   1. uncomment the import below
//   2. uncomment the <ErrorBoundary> wrapper in root.render()
//
// import ErrorBoundary from './components/ErrorBoundary.jsx'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    {/* <ErrorBoundary> */}
      <App />
    {/* </ErrorBoundary> */}
  </StrictMode>
);
