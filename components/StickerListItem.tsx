import React from 'react'
import { useDispatch } from 'react-redux'
import { I_User, StickerType } from '../redux/interfaces'
import fb from 'firebase'
import { AddStickerToSet, RemoveSticker, RemoveStickerFromSet, SetEditSticker, SetQuickEditSticker } from '../redux/actions'
import { FileMinusIcon } from './Icons/FileMinusIcon'
import { FilePlusIcon } from './Icons/FilePlusIcon'
import cn from 'classnames'
import { EditIcon } from './Icons/EditIcon'
import { useRouter } from 'next/router'
import { fbInstance } from '../firebase/firebase'
import { TrashIcon } from './Icons/TrashIcon'

interface Props {
    sticker: StickerType
    quickEdit: Function
    user: I_User
}

export function StickerListItem({ sticker, quickEdit, user }: Props) {
    const dispatch = useDispatch()
    const router = useRouter()

    async function deleteSticker() {
        let confirmDelete = confirm("Delete sticker?");
        if (confirmDelete) {
            await fbInstance.db.doc(`_stickers/${sticker.id}`).delete()
            dispatch(RemoveSticker(sticker.id))
        }
    }

    function add() {
        sticker.addedToBundle = true
        dispatch(AddStickerToSet(sticker))
    }
    function remove() {
        sticker.addedToBundle = false
        dispatch(RemoveStickerFromSet(sticker))
    }
    function redirectToEditSticker() {
        // dispatch(SetQuickEditSticker(sticker))
        router.push(`/create?editStickerId=${sticker.id}`)
        // router.push('/create')
    }

    const created = new fb.firestore.Timestamp(sticker.created.seconds, sticker.created.nanoseconds).toDate().toDateString()
    return (
        <div className={cn('sticker-item', { 'sticker-item_selected': sticker.addedToBundle })} >
            <div className=''>
                <span className="badge badge-primary">Producer: {sticker.producer.name}</span>
                {/* <span >{sticker.producer}</span> */}
                <span className="badge badge-warning">Title:{sticker.originalTitle}</span>

                {/* <span>{sticker.originalTitle}</span> */}
                {/* <span>{sticker.color}</span> */}
                {/* <span>{created}</span> */}
                {/* <span>{sticker.region}</span> */}
                <span className="badge badge-dark">SKU:{sticker.sku}</span>

                {/* <span>{sticker.sku}</span> */}
                <span onClick={() => quickEdit()}
                    className="badge badge-secondary cursor-pointer"> Vintage:{sticker.harvestYear}</span>
                {/* <span>{sticker.harvestYear}</span> */}
                <span onClick={() => quickEdit()}
                    className="badge badge-success cursor-pointer"> Lot number:{sticker.lotNumber}</span>
                {/* <span>{sticker.lotNumber}</span> */}
                <span onClick={() => quickEdit()}
                    className="badge badge-light cursor-pointer"> Bottling date:{sticker.bottlingYear}</span>
                {/* <span>{sticker.bottlingYear}</span> */}
            </div>

            <div className='d-flex'>

                {user?.admin &&
                    <div className='icon' onClick={deleteSticker}>
                        <TrashIcon />
                    </div>}

                {/* {user?.admin && <div onClick={redirectToEditSticker}
                    className='cursor-pointer'>Edit sticker</div>} */}

                {user?.admin && <div onClick={() => redirectToEditSticker()} className='icon'>
                    <EditIcon />
                </div>}

                {
                    !sticker.addedToBundle
                        ? <div className='icon' onClick={add}>
                            <FilePlusIcon size={'1.5rem'} />
                        </div>
                        : <div className='icon' onClick={remove}>
                            <FileMinusIcon size={'1.5rem'} />
                        </div>
                }
            </div>
        </div >)
}

