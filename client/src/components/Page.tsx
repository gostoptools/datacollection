import { Helmet } from "react-helmet"
import axios from "axios"
import { useState, useEffect } from "react"
import React from "react"

const instance = axios.create({
  withCredentials: true,
})

const Page = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(undefined)
  const [failed, setFailed] = useState<any>(undefined)

  useEffect(() => {
    instance.get("/api/user").then(
      res => {
        if (res.data.email) {
          setUser(res.data)
        }
      },
      e => {
        setFailed(e)
      }
    )
  }, [])

  return (
    <div>
      <Helmet>
        <title>Hwatu</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <h1 className="m-2 p-3 text-center text-xl">
        A Hwatu Data Collection Management System.
      </h1>
      {failed ? (
        <div className="m-2 p-3 text-center text-xl">
          Failed to connect to backend. {JSON.stringify(failed)}
        </div>
      ) : (
        <div className="text-center justify-between m-2 p-3 text-gray-500">
          {user ? (
            <>
              Logged in as {user.email}{" "}
              <a
                href={"/api/logout"}
                className="hover:text-blue-500 bg-blue-200 p-2 rounded-sm"
              >
                Log Out
              </a>
              {props.children}
            </>
          ) : (
            <>
              <a
                href={"/api/login"}
                className="hover:text-blue-500 bg-blue-200 p-2 rounded-sm"
              >
                Log In
              </a>
            </>
          )}
        </div>
      )}
      <footer className="m-2 text-gray-600 text-sm text-center">
        Created by Juni Kim with Gatsby, TailwindCSS, Express, Mongoose, and
        PassportJS.
      </footer>
    </div>
  )
}

export default Page
