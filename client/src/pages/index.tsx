import React from "react"
import Page from "../components/Page"
import Navigation from "../components/Navigation"

const Home = () => {
  return (
    <>
      <Page auth={true}></Page>
      <Navigation />
    </>
  )
}
export default Home
