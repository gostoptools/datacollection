import axios from "axios"
import { Component, useState } from "react"
import { BooleanForm, NumberForm, TagForm } from "./Forms"
import React from "react"

interface PlayerResult {
  won?: boolean
  previous?: { id: string; createdAt: Date }
  shake?: boolean
  poktan?: boolean
  ppeok?: number
  eat_ppeok?: number
  gwang_bak?: boolean
  pi_bak?: boolean
  first?: boolean
  tap?: boolean
}

interface SearchType extends PlayerResult {
  tags?: string
  loading: boolean
  errors: any
  data: any[]
}

export const instance = axios.create({
  withCredentials: true,
})

const defaultState = () =>
  ({
    // for pagination (not for user to change)
    previous: undefined,

    won: undefined,
    shake: undefined,
    poktan: undefined,

    // can happen multiple times
    ppeok: undefined,
    eat_ppeok: undefined,

    // all of the bak (can only happen once)
    gwang_bak: undefined,
    pi_bak: undefined,

    first: undefined,
    tap: undefined,
    tags: undefined,

    loading: false,
    errors: undefined,
    data: [],
  } as SearchType)

function ShowData(props: { data: any }) {
  const [show, setShow] = useState(false)
  return (
    <div className="m-1 p-1 rounded-lg bg-gray-200">
      <div>
        {props.data.user} {props.data.createdAt}
        {props.data.tags.map((tag: any, index: number) => (
          <span key={index} className="px-2 rounded-full mx-1 bg-green-300">
            {tag}
          </span>
        ))}{" "}
        <button onClick={() => setShow(!show)}>{show ? "-" : "+"}</button>
      </div>
      {show ? (
        <div>
          won: {props.data.won}
          <br />
          pi bak: {props.data.pi_bak ? "Yes" : "No"}
          <br />
          gwang bak: {props.data.gwang_bak ? "Yes" : "No"}
          <br />
          poktan: {props.data.poktan}
          <br />
          shake: {props.data.shake}
          <br />
          ppeok: {props.data.ppeok}
          <br />
          eating ppeok: {props.data.eat_ppeok}
          <br />
          tapped the deck: {props.data.tap ? "Yes" : "No"}
          <br />
          went first: {props.data.first ? "Yes" : "No"}
          <br />
        </div>
      ) : null}
    </div>
  )
}

export default class Filter extends Component {
  state = defaultState()

  takeQuery = async (query: SearchType) => {
    this.setState({ loading: true })
    instance
      .post("/api/search/result", query)
      .then(d => {
        if (d.status !== 200) {
          this.setState({ errors: JSON.stringify(d.data) })
        } else {
          const previous =
            d.data.length !== 0
              ? {
                  id: d.data[d.data.length - 1]?._id,
                  createdAt: d.data[d.data.length - 1]?.createdAt,
                }
              : undefined
          if (query.previous === undefined) {
            this.setState({ data: d.data, previous })
          } else {
            this.state.data.push.apply(this.state.data, d.data)
            this.setState({ data: this.state.data, previous })
          }
        }
      })
      .catch(e => {
        console.error(e)
      })
    this.setState({ loading: false })
  }
  rmprevious = () => this.setState({ previous: undefined })

  render() {
    return (
      <div className="m-2 p-3">
        <h1 className="text-xl text-black"> Filter </h1>
        <div className="bg-gray-100 m-3 p-3 rounded-lg flex flex-row flex-wrap justify-evenly">
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ won: x })
            }}
            name="Won the Game?"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ poktan: x })
            }}
            name="Poktan"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ shake: x })
            }}
            name="Shake"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ pi_bak: x })
            }}
            name="Pi bak"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ gwang_bak: x })
            }}
            name="Gwang Bak"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ tap: x })
            }}
            name="Tap"
          />
          <BooleanForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ first: x })
            }}
            name="Went First"
          />
          <NumberForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ ppeok: x })
            }}
            name="Created Ppeok"
          />
          <NumberForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ eat_ppeok: x })
            }}
            name="Ate Ppeok?"
          />
          <TagForm
            callback={(x: any) => {
              this.rmprevious()
              this.setState({ tags: x })
            }}
            name="Tags"
          />
          <button
            onClick={() => this.takeQuery(this.state)}
            className="bg-blue-300 p-1 rounded-lg"
          >
            Search
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg m-3 p-3">
          <h1 className="text-xl text-black"> Data </h1>
          {this.state.data.map((x, index) => (
            <ShowData data={x} key={index} />
          ))}
          {this.state.previous ? (
            <>
              <br />
              <button
                onClick={() => this.takeQuery(this.state)}
                className="bg-blue-300 p-1 rounded-lg"
              >
                Search
              </button>
            </>
          ) : null}
        </div>
        {this.state.loading && <div className="text-lg"> Loading... </div>}
        {this.state.errors && (
          <div className="text-lg"> Error! {this.state.errors} </div>
        )}
      </div>
    )
  }
}
