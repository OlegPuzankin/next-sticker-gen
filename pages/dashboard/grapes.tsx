import firebase from 'firebase';
import { useFormik } from 'formik';
import React from 'react';
import { DashboardNavs } from '../../components/DashboardNavs';
import { Layout } from '../../components/Layout';
import { InlineInput } from '../../components/UI/InlineInput';
import { InputWithButton } from '../../components/UI/InputWithButton';
import { Loader } from '../../components/UI/Loader';
import { Select } from '../../components/UI/Select';
import { fbInstance } from '../../firebase/firebase';
import { DashboardListItem } from '../../components/DashboardListItem'
import { I_Grape } from '../../redux/interfaces';
import { EditNamePopup } from '../../components/EditNamePopup';
import { GetServerSideProps } from 'next';
import { checkAuth } from '../../utils/server-functions';
import { Input } from '../../components/UI/Input';
import * as Yup from 'yup';


export default function DashboardGrapes() {


    const [grapes, setGrapes] = React.useState<Array<I_Grape>>([])
    const [selectedGrape, setSelectedGrape] = React.useState('')

    const [loading, setLoading] = React.useState(true)
    const [showPopup, setShowPopup] = React.useState<boolean>(false)
    const [editGrape, setEditGrape] = React.useState<I_Grape>()

    React.useEffect(() => {
        let unsubscribe: Function;
        async function load() {
            const data = []
            unsubscribe = fbInstance.db.doc('_grapes/data').onSnapshot(doc => {
                setLoading(true)
                const grapes = doc.data()
                const data: Array<I_Grape> = []
                for (const [key, value] of Object.entries(grapes)) {
                    data.push({ name: value.name, id: key })
                }
                data.sort((a, b) => a.name > b.name ? 1 : -1)
                setGrapes(data)
                setLoading(false)

            })
        }
        load()

        return function cleanup() {
            unsubscribe()
        }

    }, [])


    function showEditGrapePopup(grape: I_Grape) {
        setEditGrape(grape)
        setShowPopup(true)
    }

    const formik = useFormik({
        initialValues: {
            newGrape: '',
            // grape: ''

        },
        validationSchema: Yup.object({
            newGrape: Yup.string().required('Required'),
        }),

        onSubmit: async (values) => addGrape(values)

    })

    async function deleteGrape(grapeId: string) {
        let confirmDelete = confirm("Delete item?");
        debugger
        if (confirmDelete) {
            await fbInstance.db.doc('_grapes/data').update({ [grapeId]: firebase.firestore.FieldValue.delete() })
            formik.setFieldValue('newGrape', '')
        }
    }

    async function addGrape(values) {
        debugger
        const id = fbInstance.db.collection('_grapes').doc().id
        await fbInstance.db.doc('_grapes/data').update({ [id]: { name: values.newGrape } })
        formik.setFieldValue('newGrape', '')
    }

    async function selectGrape(grapeId: string) {
        setSelectedGrape(grapeId)

    }



    return (
        <Layout title={'Dashborad'}>
            {loading && <Loader />}

            <DashboardNavs />

            <div className='dashboard w-50'>
                <form className='d-flex w-100 mb-2' onSubmit={formik.handleSubmit}>
                    <Input
                        type={'text'}
                        name='newGrape'
                        value={formik.values.newGrape}
                        error={formik.touched.newGrape && formik.errors.newGrape}

                        placeholder={'Grape name'}
                        handleChange={formik.handleChange}
                        onBlur={formik.handleBlur}

                    />
                    <div className='ml-2 w-25'>
                        <button disabled={!formik.values.newGrape} type='submit' className={'btn btn-info w-100'}>Add grape</button>
                    </div>

                </form>


                <div className='dashboard-list h-65vh hide-scrollbar'>

                    {grapes.map(grape => <DashboardListItem
                        key={grape.id}
                        selectItem={selectGrape}
                        isSelected={grape.id === selectedGrape}
                        item={grape}
                        deleteItem={deleteGrape}
                        showEditPopup={showEditGrapePopup} />)}
                </div>


                {showPopup && <EditNamePopup
                    editField={'Edit grape name'}
                    firestorePath='_grapes/data'
                    item={editGrape}
                    closeHandler={() => setShowPopup(false)} />}

            </div>

        </Layout>)

}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const user = await checkAuth(ctx)

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}