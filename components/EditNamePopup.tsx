import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fbInstance } from '../firebase/firebase';
import { SetQuickEditSticker } from '../redux/actions';
import { Item, I_Grape } from '../redux/interfaces';
import { InlineInput } from './UI/InlineInput';
import * as Yup from 'yup';
import { StoreState } from '../redux/reducers';
import { Input } from './UI/Input';
import cn from 'classnames'



interface Props {
    // mergeData?: any
    firestorePath: string
    closeHandler: Function,
    item: Item
    editField: string
}

export function EditNamePopup({ closeHandler, item, firestorePath, editField }: Props) {

    const formik = useFormik({
        initialValues: {
            name: item.name,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            debugger
            await fbInstance.db.doc(firestorePath).update({ [item.id]: { ...item, name: values.name } })
            closeHandler()
        },
    });

    return (
        <div className='fade-background'>
            <div className='popup-modal'>
                <div className='d-flex flex-column'>
                    {/* <h5 className='font-weight-bold text-center'>Edit name</h5> */}
                    <form onSubmit={formik.handleSubmit}>
                        <div className={cn('font-weight-bold', { 'text-danger': formik.errors.name })}>{editField}</div>
                        <Input
                            value={formik.values.name}
                            name='name'
                            handleChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && formik.errors.name}
                            type="text"
                            id="inputGrape"
                            placeholder="Type grape name"
                        />

                        <div className='d-flex justify-content-center mt-3'>
                            <button
                                className={'btn btn-primary btn-sm mr-1'}
                                type={'submit'}
                            >Update
                            </button>
                            <button
                                onClick={() => closeHandler()}
                                className={'btn btn-info btn-sm'}
                            >Cancel
                            </button>

                        </div>
                    </form>
                </div>

            </div>


        </div>
    )
}