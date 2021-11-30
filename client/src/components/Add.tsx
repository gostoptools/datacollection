import React, { Component, useRef, useState } from "react"
import { TagForm, BooleanForm, NumberForm, TextForm } from "./Forms"
import { instance } from "./Filter"
import Page from "./Page"
import Navigation from "./Navigation"

interface PlayerResult {
  won: number
  shake: number
  poktan: number
  ppeok: number
  eat_ppeok: number
  gwang_bak: boolean
  pi_bak: boolean
  first: boolean
  tap: boolean
  user: string
}

const defaultResult = () =>
  ({
    won: 0,
    shake: 0,
    poktan: 0,
    ppeok: 0,
    eat_ppeok: 0,
    gwang_bak: false,
    pi_bak: false,
    first: false,
    tap: false,
    user: "",
  } as PlayerResult)

interface AddQuery {
  tags: [string]
  // value allows for passing references.
  result: [PlayerResult]
}

const defaultQuery = (length: number) =>
  ({
    tags: [] as string[],
    result: Array(length).fill(defaultResult()),
  } as AddQuery)

interface UserFormProps {
  onChange: any
}
class UserForm extends Component<UserFormProps> {
  state = defaultResult()
  onChange: any
  constructor(props: UserFormProps) {
    super(props)
    this.onChange = props.onChange
  }
  render() {
    return (
      <div className="bg-gray-100 m-3 p-3 rounded-lg flex flex-row flex-wrap justify-evenly">
        <TextForm
          callback={async (x: any) => {
            await this.setState({ user: x })
            this.onChange(this.state)
          }}
          default=""
          name="User"
        />
        <NumberForm
          callback={async (x: any) => {
            await this.setState({ won: x })
            this.onChange(this.state)
          }}
          default={0}
          name="Won"
        />
        <NumberForm
          callback={async (x: any) => {
            await this.setState({ poktan: x })
            this.onChange(this.state)
          }}
          default={0}
          name="Poktan"
        />
        <NumberForm
          callback={async (x: any) => {
            await this.setState({ shake: x })
            this.onChange(this.state)
          }}
          default={0}
          name="Shake"
        />
        <BooleanForm
          callback={async (x: any) => {
            await this.setState({ pi_bak: x })
            this.onChange(this.state)
          }}
          allowundefined={false}
          default={0}
          name="Pi bak"
        />
        <BooleanForm
          callback={async (x: any) => {
            await this.setState({ gwang_bak: x })
            this.onChange(this.state)
          }}
          allowundefined={false}
          default={false}
          name="Gwang Bak"
        />
        <BooleanForm
          callback={async (x: any) => {
            await this.setState({ tap: x })
            this.onChange(this.state)
          }}
          allowundefined={false}
          default={false}
          name="Tap"
        />
        <BooleanForm
          callback={async (x: any) => {
            await this.setState({ first: x })
            this.onChange(this.state)
          }}
          name="Went First"
          allowundefined={false}
          default={false}
        />
        <NumberForm
          callback={async (x: any) => {
            await this.setState({ ppeok: x })
            this.onChange(this.state)
          }}
          name="Ppeok"
          default={0}
        />
        <NumberForm
          callback={async (x: any) => {
            await this.setState({ eat_ppeok: x })
            this.onChange(this.state)
          }}
          name="Ate Ppeok?"
          default={0}
        />
      </div>
    )
  }
}

export default function Add(props: { pageContext: { users: number } }) {
  const query = useRef(defaultQuery(props.pageContext.users))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const submit = async () => {
    instance
      .post("/api/add", query.current)
      .then(res => {
        console.log("happens")
        if (res.status === 200) {
          setSubmitted(true)
        } else {
          setError(res.data.failure)
        }
      })
      .catch(e => {
        setError(e.response.data.failure)
      })
  }
  return (
    <Page>
      <Navigation />
      <div className="m-2 p-3 rounded-lg bg-gray-50">
        <h1> With {props.pageContext.users} Users </h1>
        <TagForm
          callback={async (x: any) => (query.current.tags = x)}
          name="Tags"
        />
        {Array(props.pageContext.users)
          .fill(null)
          .map((_, index) => (
            <UserForm
              key={index}
              onChange={(state: any) => {
                query.current.result[index] = state
              }}
            />
          ))}
        <button
          className={"m-2 p-3 " + (submitted ? "bg-blue-400" : "bg-blue-300")}
          onClick={!submitted ? submit : undefined}
        >
          Submit
        </button>
        {submitted && <>Submitted!</>}
        {error && (
          <>
            <br />
            Error! {error}
          </>
        )}
      </div>
    </Page>
  )
}
