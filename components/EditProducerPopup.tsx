import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fbInstance } from '../firebase/firebase';
import { SetQuickEditSticker } from '../redux/actions';
import { I_Grape, I_Producer } from '../redux/interfaces';
import { InlineInput } from './UI/InlineInput';
import * as Yup from 'yup';
import { StoreState } from '../redux/reducers';
import { Input } from './UI/Input';
import { TextArea } from './UI/TextArea';
import cn from 'classnames'

interface Props {
    closeHandler: Function,
    producer: I_Producer

}

export function EditProducerPopup({ closeHandler, producer }: Props) {

    const formik = useFormik({
        initialValues: {
            producerName: producer.name,
            producerFullData: producer.producerFullData
        },
        validationSchema: Yup.object({
            producerName: Yup.string().required('Required'),
            producerFullData: Yup.string().required('Required')
        }),
        onSubmit: async (values) => {
            await fbInstance.db.doc('_producers/data').update({ [producer.id]: { name: values.producerName, producerFullData: values.producerFullData } })
            closeHandler()
        },
    });

    return (
        <div className='fade-background'>
            <div className='popup-modal'>
                <div className='d-flex flex-column text-dark'>
                    <h5 className='font-weight-bold text-center'>Edit producer</h5>
                    <form onSubmit={formik.handleSubmit}>

                        <div className='mb-3'>
                            <div className={cn('font-weight-bold', { 'text-danger': formik.errors.producerName })}> Producer name</div>
                            <Input
                                value={formik.values.producerName}
                                name='producerName'
                                handleChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.producerName && formik.errors.producerName}
                                type="text"
                                id="inputGrape"
                                placeholder="Type grape name"
                            />
                        </div>

                        <div className='mb-3'>
                            <div className={cn('font-weight-bold', { 'text-danger': formik.errors.producerFullData })}>Producer's full data</div>
                            <TextArea
                                name='producerFullData'
                                value={formik.values.producerFullData}
                                error={formik.touched.producerFullData && formik.errors.producerFullData}
                                label={'Producer full data'}
                                placeholder={'Producer full data'}
                                handleChange={formik.handleChange}
                                handleBlur={formik.handleBlur}
                                rows={4}

                            />

                        </div>

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