import { useRouter } from "next/router"
import React, { ReactEventHandler } from "react"
import { Layout } from "../components/Layout"
import { Input } from "../components/UI/Input"
import { fbInstance } from "../firebase/firebase"

export default function ForgotPassword() {
  const router = useRouter()

  const [email, setEmail] = React.useState("")
  const [info, setInfo] = React.useState("Type email")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("prevent")
    await fbInstance.resetPassword(email)
    setEmail("")
    setInfo("Check email inbox and follow instuctions")
  }
  console.log(info)

  return (
    <Layout title={"Forgot password"}>
      <form
        className="flex w-25 m-auto text-center pt-5"
        onSubmit={handleSubmit}
      >
        <h1 className="h3 mb-3">{info}</h1>
        {info !== "Check email inbox and follow instuctions" && (
          <div className="d-flex">
            <Input
              value={email}
              name="email"
              handleChange={(e) => setEmail(e.target.value)}
              // onBlur={formik.handleBlur}
              // error={formik.errors.email}
              type="email"
              id="inputEmail"
              placeholder="Email address"
              required
            />
            <button type="submit" className="btn btn-primary ml-2">
              Submit
            </button>
          </div>
        )}
      </form>
    </Layout>
  )
}
