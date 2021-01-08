import { GetServerSideProps } from 'next'
import React from 'react'
import { StoreState } from '../redux/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { checkAuth } from '../utils/server-functions'
import { StickersMap, StickerType } from '../redux/interfaces'
import { getData, QueryArgs } from '../firebase/firebaseFunctions'
import { StickersCatalog } from '../components/StickersCatalog'
import { SetStickers } from '../redux/actions'
import { UserContext } from '../components/UserProvider'
import { route } from 'next/dist/next-server/server/router'


// interface Props {
//     stickers?: string,
//     initialReduxState?: StoreState,
//     lastVisibleId?: any,
//     error?: string
// }


function setFlagInBundle(stickers: Array<StickerType>, bundle: Array<StickerType>) {
    if (bundle.length === 0)
        return
    stickers.forEach(s => {
        let find = bundle.find(sb => sb.id === s.id)
        find ? s.addedToBundle = true : s.addedToBundle = false
    })
    return stickers
}


function Stickers() {
    const dispatch = useDispatch()
    const stickers = useSelector((state: StoreState) => state.stickers.stickers)
    const { user, userLoading } = React.useContext(UserContext)
    const router = useRouter()


    const [lastVisibleId, setLastVisibleId] = React.useState<string>(null)
    const [loading, setLoading] = React.useState(true)
    // const [stickers, setStickers] = React.useState<Array<StickerType>>([])
    const stickersBundle = useSelector((state: StoreState) => state.stickers.stickersBundle)


    React.useEffect(() => {
        if (!userLoading && !user) {
            router.push('/auth')
        }


    }, [user])




    //first load after search
    React.useEffect(() => {
        if (router.query.queryType) {
            setLoading(true)
            getData(router.query as unknown as QueryArgs)
                .then(({ stickers, lastVisibleId }) => {
                    setFlagInBundle(stickers, stickersBundle)
                    dispatch(SetStickers(stickers))
                    // setStickers(stickers)
                    setLastVisibleId(lastVisibleId)
                    setLoading(false)

                }).catch(e => {
                    setLoading(false)
                })
        }

    }, [router.query])



    async function loadMoreStickers() {
        const query: QueryArgs = { ...router.query, queryType: `${router.query.queryType}*`, lastVisibleId }
        setLoading(true)
        getData(query).then(({ stickers: newStickers, lastVisibleId }) => {
            const embeddedStickers = [...stickers, ...newStickers]
            setFlagInBundle(embeddedStickers, stickersBundle)
            dispatch(SetStickers(embeddedStickers))
            // setStickers(embeddedStickers)
            setLastVisibleId(lastVisibleId)
            setLoading(false)
        }).catch(e => {
            setLoading(false)
        })
    }



    return (
        <StickersCatalog
            stickers={stickers}
            lastVisibleId={lastVisibleId}
            loadMoreStickers={loadMoreStickers}
            loading={loading}
        />)
}


// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//     const user = await checkAuth(ctx)

//     if (!user) {
//         return {
//             redirect: {
//                 destination: '/auth',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {}
//     }
// }


export default Stickers






