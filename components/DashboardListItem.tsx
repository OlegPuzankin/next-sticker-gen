import React from 'react'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { EditIcon } from './Icons/EditIcon'
import { FileMinusIcon } from './Icons/FileMinusIcon'
import { I_Grape } from '../redux/interfaces'
import { fbInstance } from '../firebase/firebase'
import firebase from 'firebase'
import { TrashIcon } from './Icons/TrashIcon'

type Item = {
    id: string
    name: string
}

interface Props {
    item: Item
    showEditPopup: Function
    deleteItem: Function
    selectItem: Function
    isSelected: boolean
}

export function DashboardListItem({ item, showEditPopup, deleteItem, isSelected, selectItem }: Props) {


    return (
        <div
            className={cn('dashboard-item', { 'dashboard-item_selected': isSelected })}
            onClick={() => selectItem(item.id)}>
            <div>
                {item.name}
            </div>

            {isSelected && <div className='d-flex'>

                <div className='mr-2 icon' onClick={() => showEditPopup(item)}>
                    <EditIcon />
                </div>

                <div className='icon' onClick={() => deleteItem(item.id)}>
                    <TrashIcon />

                </div>

            </div>}
        </div >)
}

