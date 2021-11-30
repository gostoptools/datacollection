import React, { useState, useEffect } from "react"
import { instance } from "./Filter"

export function BooleanForm(props: {
  callback: any
  name: string
  id?: number
  default?: any
  allowundefined?: boolean
}) {
  return (
    <div className="m-1 p-1 rounded-lg bg-gray-200">
      <span className="mx-1 bg-blue-200">{props.name}</span>
      <label>
        {" "}
        True{" "}
        <input
          type="radio"
          name={props.name + (props.id ? props.id : "")}
          value="true"
          onChange={e => {
            if (e.target.value == "true") props.callback(true)
          }}
        />{" "}
      </label>
      <label>
        {" "}
        False{" "}
        <input
          type="radio"
          name={props.name + (props.id ? props.id : "")}
          value="false"
          onChange={e => {
            if (e.target.value == "false") props.callback(false)
          }}
        />{" "}
      </label>
      {props.allowundefined !== false && (
        <label>
          {" "}
          Nothing{" "}
          <input
            type="radio"
            name={props.name + (props.id ? props.id : "")}
            value="undefined"
            onChange={e => {
              if (e.target.value == "undefined") props.callback(props.default)
            }}
          />{" "}
        </label>
      )}
    </div>
  )
}

export function NumberForm(props: {
  callback: any
  name: string
  default?: any
}) {
  return (
    <div className="m-1 p-1 rounded-lg bg-gray-200">
      <label>
        <span className="mx-1 bg-blue-200">{props.name}</span>
        <input
          type="number"
          name={props.name}
          onChange={e =>
            props.callback(
              e.target.value == "" ? props.default : parseInt(e.target.value)
            )
          }
        />{" "}
      </label>
    </div>
  )
}

export function TagForm(props: { callback: any; name: string; default?: any }) {
  return (
    <div className="m-1 p-1 rounded-lg bg-gray-200">
      <label>
        <span className="mx-1 bg-blue-200">{props.name}</span>
        <input
          type="text"
          name={props.name}
          onChange={e =>
            props.callback(
              e.target.value == "" ? undefined : e.target.value.split(/\s+/)
            )
          }
        />{" "}
      </label>
    </div>
  )
}

export function TextForm(props: {
  callback: any
  name: string
  default?: any
  id?: number
}) {
  const [users, setUsers] = useState<string[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await instance.get("/api/user/all")
        await setUsers(res.data)
      } catch (e: any) {}
    })()
  }, [])
  return (
    <div className="m-1 p-1 rounded-lg bg-gray-200">
      <label>
        <span className="mx-1 bg-blue-200">{props.name}</span>
        <select
          name={props.name + (props.id ? props.id : "")}
          onChange={e => {
            props.callback(e.target.value)
          }}
        >
          {[""].concat(users).map((user: string, key: number) => (
            <option value={user} key={key}>
              {user}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
