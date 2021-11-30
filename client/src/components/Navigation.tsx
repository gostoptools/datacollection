import React from "react"
import { Link } from "gatsby"

export default function Navigation() {
  return (
    <div className="m-2 p-3 text-center text-blue-800">
      <Link to="/">
        <a>Home Page</a>
      </Link>
      <br />
      <Link to="/filter">
        <a>Search Results</a>
      </Link>
      <br />
      <Link to="/add">
        <a>Add New Data</a>
      </Link>
    </div>
  )
}
