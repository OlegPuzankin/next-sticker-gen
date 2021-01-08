import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../components/Layout';
import { UserContext } from '../components/UserProvider';

export default function ProfilePage() {

    const { user } = React.useContext(UserContext)
    const router = useRouter()

    React.useEffect(() => {
        if (!user) {
            setTimeout(() => router.push('/auth'), 250)
        }
    }, [])



    return (
        <Layout title={'Auth'}>
            {user &&
                <>
                    <div>{user.id}</div>
                    <div>{user.email}</div>
                    <div>{user.name}</div>
                </>
            }

        </Layout>

    )
}