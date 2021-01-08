import { types } from './types';
import fb from 'firebase'


export type Action = SetStickersAction | SetUserAction | AddStickerToSetAction |
    RemoveStickerFromSetAction | SetQuickEditStickerAction | ResetStickersAction |
    SetSubjectsAction | SetEditStickerAction | RemoveStickerAction

export interface SetStickersAction {
    type: types.setStickers,
    payload: Array<StickerType>
}
export interface RemoveStickerAction {
    type: types.removeSticker,
    payload: string
}
export interface AddStickerToSetAction {
    type: types.addStickerToSet,
    payload: StickerType
}
export interface RemoveStickerFromSetAction {
    type: types.removeStickerFromSet,
    payload: StickerType
}
export interface SetQuickEditStickerAction {
    type: types.setQuickEditSticker,
    payload: StickerType
}
export interface SetEditStickerAction {
    type: types.setEditSticker,
    payload: StickerType
}
export interface SetSubjectsAction {
    type: types.setSubjects,
    payload: SubjectsType
}
export interface ResetStickersAction {
    type: types.resetStickers,
}



export interface SetUserAction {
    type: types.setUser,
    payload: fb.User
}



export interface StickerType {
    id?: string
    alcohol: string
    appellation: I_Appellation
    bottlingYear: string
    color: string
    country: I_Country
    created: fb.firestore.Timestamp
    harvestYear: string
    lotNumber: string
    originalTitle: string
    producer: I_Producer
    region: I_Region
    regionControl: string
    selectedGrapes: Array<I_Grape>
    servingTemperature: string
    shelfLifetime: string
    sku: string
    stickerTitle: string
    sugar: string
    volume: string

    barcode: string
    authorId: string

    addedToBundle?: boolean
    isUpdated?: boolean
}
export interface _StickerType {
    id?: string
    alcohol: string
    appellationId: string
    bottlingYear: string
    color: string
    countryId: string
    created: fb.firestore.Timestamp
    harvestYear: string
    lotNumber: string
    originalTitle: string
    producerId: string
    regionId: string
    regionControl: string
    selectedGrapes: Array<string>
    servingTemperature: string
    shelfLifetime: string
    sku: string
    stickerTitle: string
    sugar: string
    volume: string
    barcode: string

    addedToBundle?: boolean
    isUpdated?: boolean
}

export interface StickersMap {
    [key: string]: StickerType
}

export interface I_Producer {
    id: string
    name: string
    producerFullData: string
}
export interface ProducersMap {
    [key: string]: I_Producer
}

export interface I_Country {
    id: string
    name: string

}
export interface CountriesMap {
    [key: string]: I_Country
}
export interface I_Region {
    id: string
    name: string
    country: string
    countryId: string
}
export interface RegionsMap {
    [key: string]: I_Region
}

export interface I_Appellation {
    id: string
    name: string
    region: string
    regionId: string
}
export interface AppellationsMap {
    [key: string]: I_Appellation
}
export interface I_Grape {
    id: string
    name: string
}
export interface GrapesMap {
    [key: string]: I_Grape
}

export interface SubjectsType {
    countries: { array: Array<I_Country>, map: CountriesMap }
    regions?: { array: Array<I_Region>, map: RegionsMap }
    appellations?: { array: Array<I_Appellation>, map: AppellationsMap }
    producers?: { array: Array<I_Producer>, map: ProducersMap }
    grapes?: { array: Array<I_Grape>, map: GrapesMap }
}

export interface Item {
    id: string
    name: string
}


export interface I_MapObject<T> {
    [key: string]: T
}


export interface I_User {
    id: string
    email: string
    name: string
    createdAt: fb.firestore.Timestamp
    admin: boolean
}


