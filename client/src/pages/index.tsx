import React from "react"
import Page from "../components/Page"
import Navigation from "../components/Navigation"

const Home = () => {
  return (
    <Page>
      <Navigation />
      <div>Powered by API {process.env.NEXT_PUBLIC_BACKEND!}</div>
    </Page>
  )
}
export default Home
