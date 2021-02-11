import Head from "next/head"
import { useRouter } from "next/router"
import { Navbar } from "./Navbar"

export function Layout({ children, title }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {router.pathname !== "/auth" &&
        router.pathname !== "/forgot-password" && <Navbar />}
      <div className="container-fluid">{children}</div>
    </>
  )
}
