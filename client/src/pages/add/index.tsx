import React from "react"
import Page from "../../components/Page"
import { Link } from "gatsby"
import Navigation from "../../components/Navigation"

const AddPage = () => {
  return (
    <Page auth={true}>
      <Navigation />
      <h1 className="text-xl text-black"> Select Game Mode </h1>
      <Link to="/add/2" className="hover:text-blue-300">
        Mat-Go
      </Link>
      <br />
      <Link to="/add/3" className="hover:text-blue-300">
        Go-Stop (3)
      </Link>
      <br />
    </Page>
  )
}

export default AddPage
