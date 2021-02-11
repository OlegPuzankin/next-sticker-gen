import { Layout } from "../components/Layout"
import { fbInstance } from "../firebase/firebase"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { Input } from "../components/UI/Input"
import React from "react"
import { Loader } from "../components/UI/Loader"
import { UserContext } from "../components/UserProvider"

function getCookie(name: string) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

function Auth() {
  const [login, setLogin] = React.useState(true)
  const [loginError, setLoginError] = React.useState(null)
  let [countTrySubmit, setCountTrySubmit] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  // const { user } = React.useContext(UserContext)

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      userName: "",
    },

    onSubmit: async ({ email, password, userName }) => {
      setIsSubmitting(true)
      try {
        if (login) {
          await fbInstance.login(email, password)
          const timerId = setInterval(() => {
            console.log("interval")
            if (getCookie("firebaseAuthToken")) {
              router.push("/stickers/?queryType=getRecent")
              console.log("success redirect")
              clearInterval(timerId)
            }
          }, 25)

          setIsSubmitting(false)
          // setTimeout(() => router.push("/stickers/?queryType=getRecent"), 500)
        } else {
          await fbInstance.register(userName, email, password)
          const timerId = setInterval(() => {
            console.log("interval")
            if (getCookie("firebaseAuthToken")) {
              router.push("/stickers/?queryType=getRecent")
              console.log("success redirect")
              clearInterval(timerId)
            }
          }, 25)
          setIsSubmitting(false)
        }
      } catch (error) {
        debugger
        setLoginError(error.message)
        setCountTrySubmit(countTrySubmit + 1)
        setIsSubmitting(false)
      }
    },
  })
  console.log("count", countTrySubmit)

  return (
    <Layout title={"Auth"}>
      {isSubmitting && <Loader />}
      <form className="form-signin" onSubmit={formik.handleSubmit}>
        <img className="mb-4" src="/app-logo.png" alt="" width="50" />

        <h1 className="h3 mb-3">
          {login ? "Please sign in" : "Create account"}
        </h1>
        <Input
          value={formik.values.email}
          name="email"
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          type="email"
          id="inputEmail"
          placeholder="Email address"
          required
        />
        {!login && (
          <Input
            value={formik.values.userName}
            name="userName"
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            type="text"
            id="userName"
            placeholder="Username"
            required
          />
        )}
        <Input
          value={formik.values.password}
          name="password"
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          type="password"
          id="inputPassword"
          placeholder="Password"
          required
        />
        {loginError && <p className="error-message">{loginError}</p>}

        <button className={"w-100 btn btn-lg btn-primary"} type="submit">
          {login ? `Sign in` : "Sign Up"}
        </button>
        {login && (
          <div onClick={() => setLogin(false)} className="createAccountButton">
            Create account?
          </div>
        )}
        {countTrySubmit > 1 && (
          <div
            onClick={() => router.push("/forgot-password")}
            className="text-danger font-weight-bold mt-2 cursor-pointer"
          >
            Forgot password?
          </div>
        )}
        <p className="mt-5 mb-3 text-muted">
          &copy; 2020. Created by Puzankin Oleg
        </p>
      </form>
    </Layout>
  )
}

export default Auth
