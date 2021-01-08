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

            return await axios.post(`${process.env.SERVER_URL}/api/auth`, { firebaseAuthToken })
        }
    } catch (e) {
    }
}
