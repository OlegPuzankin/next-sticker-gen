import { I_MapObject, I_Producer, I_Country, I_Region, I_Appellation, StickerType } from './../redux/interfaces';
import { fbInstance } from './firebase'
import firebase from 'firebase'

function processData(snapshot: firebase.firestore.QuerySnapshot, count: number) {
    let lastVisibleId: string
    if (snapshot.docs.length === count)
        lastVisibleId = snapshot.docs[snapshot.docs.length - 1].id
    else
        lastVisibleId = null
    const stickers = snapshot.docs.map(doc => {
        return { ...doc.data(), id: doc.id } as StickerType
    });

    return { lastVisibleId, stickers }
}


export const query = {
    'getRecent': getRecent,
    'getRecent*': getMoreRecent,
    'searchByProducer': searchByProducer,
    'searchByProducer*': getMoreByProducer,
    'searchByCountry': searchByCountry,
    'searchByCountry*': getMoreByCountry,
    'searchByRegion': searchByRegion,
    'searchByRegion*': getMoreByRegion,
    'searchBySKU': searchBySKU,
}

export type QueryArgs = {
    queryType: string
    count?: number,
    lastVisibleId?: string,
    producerId?: string,
    countryId?: string
    regionId?: string,
    sku?: string

}

export type ReturnDataLoad = {
    stickers: Array<StickerType>
    lastVisibleId?: string
}

export async function getData(args?: QueryArgs): Promise<ReturnDataLoad> {
    const fbQuery = query[args.queryType]
    return await fbQuery(args)
}

async function getRecent({ count = 5 }: QueryArgs) {
    const snapshot = await fbInstance.db.collection('_stickers')
        .orderBy('created', 'desc')
        .limit(count)
        .get()

    return processData(snapshot, count)

}

async function getMoreRecent({ count = 5, lastVisibleId }: QueryArgs) {
    const lastSticker = await fbInstance.db.collection('_stickers').doc(lastVisibleId).get()
    const snapshot = await fbInstance.db.collection('_stickers')
        .orderBy('created', 'desc')
        .startAfter(lastSticker)
        .limit(count)
        .get()
    return processData(snapshot, count)

}
async function searchByProducer({ producerId, count = 5 }: QueryArgs) {
    // debugger
    // const prodRef = await fbInstance.db.doc(`_producers/${producerId}`).get() as firebase.firestore.DocumentSnapshot<I_Producer>
    // if (!prodRef.exists)
    //     return
    // debugger

    const snapshot = await fbInstance.db.collection('_stickers')
        .where('producer.id', '==', producerId)
        .orderBy('created', 'desc')
        .limit(count)
        .get()
    debugger

    return processData(snapshot, count)

}

async function getMoreByProducer({ producerId, lastVisibleId, count = 5 }: QueryArgs) {
    // const prodRef = await fbInstance.db.collection('producers').doc(producerId).get() as firebase.firestore.DocumentSnapshot<I_Producer>
    // if (!prodRef.exists)
    //     return
    const lastSticker = await fbInstance.db.collection('_stickers').doc(lastVisibleId).get()
    const snapshot = await fbInstance.db.collection('_stickers')
        .where('producer.id', '==', producerId)
        .orderBy('created', 'desc')
        .startAfter(lastSticker)
        .limit(count)
        .get()
    return processData(snapshot, count)
}

async function searchByCountry({ countryId, count = 5 }: QueryArgs) {
    // const countryRef = await fbInstance.db.collection('countries').doc(countryId).get() as firebase.firestore.DocumentSnapshot<I_Country>
    // if (!countryRef.exists)
    //     return

    const snapshot = await fbInstance.db.collection('_stickers')
        .where('country.id', '==', countryId)
        .orderBy('created', 'desc')
        .limit(count)
        .get()
    return processData(snapshot, count)

}

async function getMoreByCountry({ countryId, lastVisibleId, count = 5 }: QueryArgs) {
    // const countryRef = await fbInstance.db.collection('countries').doc(countryId).get()
    // if (!countryRef.exists)
    //     return
    const lastSticker = await fbInstance.db.collection('_stickers').doc(lastVisibleId).get()
    const snapshot = await fbInstance.db.collection('_stickers')
        .where('country.id', '==', countryId)
        .orderBy('created', 'desc')
        .startAfter(lastSticker)
        .limit(count)
        .get()
    return processData(snapshot, count)

}

async function searchByRegion({ regionId, count = 5 }: QueryArgs) {
    // const regionRef = await fbInstance.db.collection('regions').doc(regionId).get()
    // if (!regionRef.exists)
    //     return


    const snapshot = await fbInstance.db.collection('_stickers')
        .where('region.id', '==', regionId)
        .orderBy('created', 'desc')
        .limit(count)
        .get()


    return processData(snapshot, count)

}

async function getMoreByRegion({ regionId, lastVisibleId, count = 5 }: QueryArgs) {
    // const regionRef = await fbInstance.db.collection('regions').doc(regionId).get()
    // if (!regionRef.exists)
    //     return
    const lastSticker = await fbInstance.db.collection('_stickers').doc(lastVisibleId).get()
    const snapshot = await fbInstance.db.collection('_stickers')
        .where('region.id', '==', regionId)
        .orderBy('created', 'desc')
        .startAfter(lastSticker)
        .limit(count)
        .get()

    return processData(snapshot, count)
}

async function searchBySKU({ sku, count = 5 }: QueryArgs) {
    let stickers: Array<StickerType>
    let lastVisibleId: string | null
    const snapshot = await fbInstance.db.collection('_stickers')
        .where('sku', '==', sku)
        // .orderBy('created', 'desc')
        .limit(count)
        .get()


    return processData(snapshot, count)
}


export async function loadCollection<T>(collection: string) {
    return fbInstance.db.collection(collection).get().then(snapShot => {
        return snapShot.docs.map(doc => {
            //@ts-ignore
            return { id: doc.id, ...doc.data() } as T
            // return { id: doc.id, ...data }
        })
    })

}
export async function loadMapCollection<T>(collection: string) {
    const array = await fbInstance.db.collection(collection).get().then(snapShot => {
        return snapShot.docs.map(doc => {
            //@ts-ignore
            return { id: doc.id, ...doc.data() } as T
            // return { id: doc.id, ...data }
        })
    })

    const map: I_MapObject<T> = {}
    array.forEach(i => {
        //@ts-ignore
        map[i.id] = i
    })

    return { array, map }

}

export async function getCollection<T, K>(docPath: string, keys: Array<keyof T>, sortingField: keyof T) {
    const docRef = await fbInstance.db.doc(docPath).get()
    const map = docRef.data() as K
    const array: Array<T> = []


    for (const [key, value] of Object.entries(map)) {
        const obj: any = {}
        for (const k of keys) {
            obj[k] = value[k]
        }
        array.push({ id: key, ...obj })
    }
    return {
        array: array.sort((a, b) => a[sortingField] > b[sortingField] ? 1 : -1),
        map
    }
}

export async function saveSticker(id: string, sticker: StickerType) {
    debugger
    await fbInstance.db.doc('_stickers/data').update({
        [id]: sticker
    })
}

export async function saveStickerDoc(sticker: StickerType) {
    debugger
    await fbInstance.db.collection('_stickers').add(sticker)

}








