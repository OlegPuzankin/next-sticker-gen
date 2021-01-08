import { AddStickerToSetAction, RemoveStickerAction, RemoveStickerFromSetAction, ResetStickersAction, SetEditStickerAction, SetQuickEditStickerAction, SetStickersAction, SetSubjectsAction, SetUserAction, StickerType, SubjectsType } from './interfaces'
import { types } from './types'
import fb from 'firebase'

export const SetStickers = (stickers: Array<StickerType>): SetStickersAction => ({
    type: types.setStickers,
    payload: stickers
})
export const RemoveSticker = (stickerId: string): RemoveStickerAction => ({
    type: types.removeSticker,
    payload: stickerId
})

export const AddStickerToSet = (sticker: StickerType): AddStickerToSetAction => ({
    type: types.addStickerToSet,
    payload: sticker
})

export const RemoveStickerFromSet = (sticker: StickerType): RemoveStickerFromSetAction => ({
    type: types.removeStickerFromSet,
    payload: sticker
})
export const ResetStickers = (): ResetStickersAction => ({
    type: types.resetStickers,
})


export const SetQuickEditSticker = (sticker: StickerType): SetQuickEditStickerAction => ({
    type: types.setQuickEditSticker,
    payload: sticker
})
export const SetEditSticker = (sticker: StickerType): SetEditStickerAction => ({
    type: types.setEditSticker,
    payload: sticker
})

export const SetSubjects = (subjects: SubjectsType): SetSubjectsAction => ({
    type: types.setSubjects,
    payload: subjects
})

export const SetUser = (user: fb.User): SetUserAction => ({
    type: types.setUser,
    payload: user
})


// export type MainActionType = ReturnType<InferValueTypes<typeof mainActions>>