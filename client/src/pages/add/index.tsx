import React from "react"
import Page from "../../components/Page"
import { Link } from "gatsby"
import Navigation from "../../components/Navigation"

const AddPage = () => {
  return (
    <Page>
      <Navigation />
      <h1 className="text-xl text-black"> Select Game Mode </h1>
      <Link to="/add/2">
        <a className="hover:text-blue-300">Mat-Go</a>
      </Link>
      <br />
      <Link to="/add/3">
        <a className="hover:text-blue-300">Go-Stop</a>
      </Link>
      <br />
      <Link to="/add/4">
        <a className="hover:text-blue-300">Go-Stop (4)</a>
      </Link>
      <br />
      <Link to="/add/5">
        <a className="hover:text-blue-300">Go-Stop (5)</a>
      </Link>
      <br />
      <Link to="/add/6">
        <a className="hover:text-blue-300">Go-Stop (6)</a>
      </Link>
      <br />
    </Page>
  )
}

export default AddPage
