import Head from 'next/head'
import { useRouter } from 'next/router'
import { Navbar } from './Navbar'

export function Layout({ children, title }) {

    const router = useRouter()

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            {router.pathname !== '/auth' && <Navbar />}
            <div className='container-fluid py-2 px-5'>{children}</div>
        </>)
}