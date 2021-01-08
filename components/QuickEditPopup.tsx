import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fbInstance } from '../firebase/firebase';
import { SetQuickEditSticker, SetStickers } from '../redux/actions';
import { InlineInput } from './UI/InlineInput';
import * as Yup from 'yup';
import { StoreState } from '../redux/reducers';
import { StickerType } from '../redux/interfaces';

interface Props {
    closeHandler: Function

}

export function QuickEditPopup({ closeHandler }: Props) {
    const dispatch = useDispatch()
    const quickEditSticker = useSelector((state: StoreState) => state.stickers.quickEditSticker)
    const stickers = useSelector((state: StoreState) => state.stickers.stickers)



    const formik = useFormik({
        initialValues: {
            lotNumber: quickEditSticker?.lotNumber,
            harvestYear: quickEditSticker?.harvestYear,
            bottlingYear: quickEditSticker?.bottlingYear
        },
        validationSchema: Yup.object({
            lotNumber: Yup.string().required('Required'),
            harvestYear: Yup.string().required('Required'),
            bottlingYear: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {


            await fbInstance.db.doc(`_stickers/${quickEditSticker.id}`).update({
                lotNumber: values.lotNumber,
                harvestYear: values.harvestYear,
                bottlingYear: values.bottlingYear,
            })

            const updatedSticker = {
                ...quickEditSticker,
                lotNumber: values.lotNumber,
                harvestYear: values.harvestYear,
                bottlingYear: values.bottlingYear
            }
            const index = stickers.findIndex((s) => s.id === quickEditSticker.id)
            if (index !== -1) {
                stickers[index] = updatedSticker
                dispatch(SetStickers(stickers))
            }



            dispatch(SetQuickEditSticker(null))
            closeHandler()
        },
    });


    return (
        <div className='fade-background'>
            <div className='popup-modal'>
                <div className='d-flex flex-column'>
                    <div className='text-center text-uppercase mb-2'>{quickEditSticker?.stickerTitle}</div>
                    {/* LOT NUMBER */}
                    <form onSubmit={formik.handleSubmit}>
                        <InlineInput
                            inputAttributes={{
                                name: 'lotNumber',
                                value: formik.values.lotNumber,
                                type: 'text',
                                onChange: formik.handleChange,
                                onBlur: formik.handleBlur,
                                placeholder: 'Lot number'
                            }}
                            error={formik.touched.lotNumber && formik.errors.lotNumber}
                            labelWidth={150}
                            labelStyle={'font-weight-bold'}
                            label={'Lot number'}
                        />
                        {/* HARVEST YEAR */}
                        <InlineInput
                            inputAttributes={{
                                name: 'harvestYear',
                                value: formik.values.harvestYear,
                                type: 'number',
                                onChange: formik.handleChange,
                                onBlur: formik.handleBlur,
                                placeholder: 'Harvest year'
                            }}
                            error={formik.touched.harvestYear && formik.errors.harvestYear}
                            labelWidth={150}
                            labelStyle={'font-weight-bold'}
                            label={'Vintage'}

                        />

                        {/* HARVEST YEAR */}
                        <InlineInput
                            inputAttributes={{
                                name: 'bottlingYear',
                                value: formik.values.bottlingYear,
                                type: 'date',
                                onChange: formik.handleChange,
                                onBlur: formik.handleBlur,
                                // placeholder: 'Harvest yeat'
                            }}
                            error={formik.touched.bottlingYear && formik.errors.bottlingYear}
                            labelWidth={150}
                            labelStyle={'font-weight-bold'}
                            label={'Bottling date'}
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