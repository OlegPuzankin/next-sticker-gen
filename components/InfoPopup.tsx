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
    message: string
    closeHandler: Function,

}

export function InfoPopup({ closeHandler, message }: Props) {



    return (
        <div className='fade-background'>
            <div className='popup-modal'>

                <div className='text-center font-weight-bold text-uppercase'>{message}</div>


                <div className='text-center mt-3'>

                    <button
                        onClick={() => closeHandler()}
                        className={'btn btn-warning w-50 font-weight-bold'}
                    >OK
                            </button>

                </div>

            </div>
        </div>
    )
}