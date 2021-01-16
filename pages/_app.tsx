import "bootstrap/dist/css/bootstrap.css"
import "../styles/globals.css"
import "../styles/index.scss"
import NextNprogress from "nextjs-progressbar"
import { Provider } from "react-redux"
import UserProvider from "../components/UserProvider"
import { store } from "../redux/store_client"
import React from "react"

function MyApp({ Component, pageProps }) {
  // const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <NextNprogress
        options={{
          showSpinner: false,
        }}
        color="#1e97c7"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <Provider store={store}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Provider>
    </>
  )
}

export default MyApp
