import { combineReducers } from 'redux'
import { Action, StickerType, SubjectsType } from './interfaces'
import { types } from './types'
import fb from 'firebase'




interface I_Stickers_State {
    stickers: Array<StickerType>,
    stickersBundle: Array<StickerType>,
    quickEditSticker: StickerType,
    subjects: SubjectsType
}

interface I_User_State {
    user: fb.User | null,
}

const initialStickersState: I_Stickers_State = {
    stickers: [],
    stickersBundle: [],
    quickEditSticker: null,
    subjects: {
        countries: { array: [], map: {} },
        regions: { array: [], map: {} },
        appellations: { array: [], map: {} },
        producers: { array: [], map: {} },
        grapes: { array: [], map: {} },

    }
}
const initialUserState: I_User_State = {
    user: null,
}

const stickersReducer = (state = initialStickersState, action: Action): I_Stickers_State => {
    switch (action.type) {


        case types.setStickers:
            return {
                ...state, stickers: action.payload
            }

        case types.removeSticker:
            return {
                ...state, stickers: state.stickers.filter((s) => s.id !== action.payload)
            }
        case types.addStickerToSet:
            return {

                ...state, stickersBundle: [...state.stickersBundle, action.payload]
            }
        case types.removeStickerFromSet:
            return {

                ...state, stickersBundle: state.stickersBundle.filter((s) => s.id !== action.payload.id)
            }

        case types.resetStickers:
            return {

                ...state, stickersBundle: []
            }
        case types.setSubjects:
            return {

                ...state, subjects: action.payload
            }

        case types.setQuickEditSticker:
            return {

                ...state, quickEditSticker: action.payload
            }

        default:
            return state
    }
}

const userReducer = (state = initialUserState, action: Action): I_User_State => {

    switch (action.type) {


        case types.setUser:
            return {
                ...state, user: action.payload
            }


        default:
            return state
    }
}


export interface StoreState {
    stickers: I_Stickers_State
    user: I_User_State
}

export const rootReducer = combineReducers<StoreState>({
    stickers: stickersReducer,
    user: userReducer
})



