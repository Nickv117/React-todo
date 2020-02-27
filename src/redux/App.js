import React from "react"
import { Provider } from "react-redux"
import store from "./store"
import { BrowserRouter as Router } from "react-router-dom"

export default props => {
  return (
    <Router>
      <Provider store={store}>{props.children}</Provider>
    </Router>
  )
}
