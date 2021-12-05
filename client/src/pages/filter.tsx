import React from "react"
import Filter from "../components/Filter"
import Page from "../components/Page"
import Navigation from "../components/Navigation"

export default function filter() {
  return (
    <Page auth={false}>
      <Navigation />
      <Filter />
    </Page>
  )
}
