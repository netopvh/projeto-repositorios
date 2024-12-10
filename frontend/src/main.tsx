/* eslint-disable react/react-in-jsx-scope */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.scss"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import App from "./App.tsx"
import { Provider } from "react-redux"
import { store } from "./store"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </StrictMode>,
)
