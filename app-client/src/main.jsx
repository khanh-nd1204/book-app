import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import 'nprogress/nprogress.css'
import './util/i18n/i18n.js'
// import React from 'react'

createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>

    // </React.StrictMode>
)
