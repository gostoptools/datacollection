import React from "react"
import { Link } from "gatsby"

export default function Navigation() {
  return (
    <div className="m-2 p-3 text-center text-blue-800">
      <Link to="/">Home Page</Link>
      <br />
      <Link to="/filter">Search Results</Link>
      <br />
      <Link to="/add">Add New Data</Link>
    </div>
  )
}
