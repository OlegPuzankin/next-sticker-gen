import { GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'

import axios from 'axios'

export async function checkAuth(ctx: GetServerSidePropsContext) {
    debugger
    const { firebaseAuthToken } = parseCookies(ctx)

    try {
        if (!firebaseAuthToken) {
            return null
        } else {
            console.log('checkAuth ---process.env.SERVER_URL-->', process.env.SERVER_URL);
            return await axios.post(`${process.env.SERVER_URL}/api/auth`, { firebaseAuthToken })
        }
    } catch (e) {
    }
}
