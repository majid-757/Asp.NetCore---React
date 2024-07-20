import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './sass/main.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { StoreProvider } from './context/StoreContext'
import { Provider } from 'react-redux'
import { store } from './redux/store/configureStore'
import { axiosInterceptor } from './actions/agent'

axiosInterceptor(store)

ReactDOM.render(
  <Router>
    <StoreProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </StoreProvider>
  </Router>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
