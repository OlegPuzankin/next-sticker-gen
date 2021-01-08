import React from 'react'
import { Layout } from '../../components/Layout'
import { DashboardNavs } from '../../components/DashboardNavs'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { checkAuth } from '../../utils/server-functions'

export default function Dashboard() {
    // const [loading, setLoading] = React.useState(true)
    // const dispatch = useDispatch()
    const router = useRouter()


    // redirect
    React.useEffect(() => {
        router.push('/dashboard/geo')
    }, [])

    return (
        <Layout title={'Dashborad'}>
            <DashboardNavs />
        </Layout>

    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const user = await checkAuth(ctx)

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}