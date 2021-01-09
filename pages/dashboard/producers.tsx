import firebase from 'firebase';
import { useFormik } from 'formik';
import React from 'react';
import { DashboardNavs } from '../../components/DashboardNavs';
import { EditProducerPopup } from '../../components/EditProducerPopup';
import { DashboardListItem } from '../../components/DashboardListItem';
import { Layout } from '../../components/Layout';
import { Input } from '../../components/UI/Input';
import { InputWithButton } from '../../components/UI/InputWithButton';
import { Loader } from '../../components/UI/Loader';
import { TextArea } from '../../components/UI/TextArea';
import { fbInstance } from '../../firebase/firebase';
import { I_Producer } from '../../redux/interfaces';
import * as Yup from 'yup';

export default function DashboardProducers() {

    const [producers, setProducers] = React.useState<Array<I_Producer>>([])
    const [selectedProducer, setSelectedProducer] = React.useState('')

    const [loading, setLoading] = React.useState(true)
    const [showPopup, setShowPopup] = React.useState<boolean>(false)
    const [editProducer, setEditProducer] = React.useState<I_Producer>()

    React.useEffect(() => {
        let unsubscribe: Function;
        async function load() {

            unsubscribe = fbInstance.db.doc('_producers/data').onSnapshot(doc => {
                setLoading(true)
                const producers = doc.data()
                const data: Array<I_Producer> = []
                for (const [key, value] of Object.entries(producers)) {
                    data.push({ name: value.name, id: key, producerFullData: value.producerFullData })
                }
                data.sort((a, b) => a.name > b.name ? 1 : -1)
                setProducers(data)
                setLoading(false)

            })
        }
        load()

        return function cleanup() {
            unsubscribe()
        }

    }, [])

    function showEditProducerPopup(producer: I_Producer) {
        setEditProducer(producer)
        setShowPopup(true)
    }

    type formikValues = {
        newProducerName: string
        newProducerFullData: string
    }

    const formik = useFormik({
        initialValues: {
            newProducerName: '',
            newProducerFullData: '',

        },
        validationSchema: Yup.object({
            newProducerName: Yup.string().required('Required'),
            newProducerFullData: Yup.string().required('Required'),
        }),
        onSubmit: (values) => addProducer(values)

    })

    async function addProducer(values: formikValues) {
        debugger
        const id = fbInstance.db.collection('_producers').doc().id
        await fbInstance.db.doc('_producers/data').update({
            [id]: {
                name: values.newProducerName,
                producerFullData: values.newProducerFullData
            }
        })
        formik.setValues({ newProducerName: '', newProducerFullData: '' })
    }
    async function deleteProducer(producerId: string) {
        let confirmDelete = confirm("Delete item?");
        debugger
        if (confirmDelete) {
            await fbInstance.db.doc('_producers/data').update({ [producerId]: firebase.firestore.FieldValue.delete() })
            formik.setValues({ newProducerName: '', newProducerFullData: '' })
        }
    }
    function selectProducer(producerId: string) {
        setSelectedProducer(producerId)

    }


    return (
        <Layout title={'Dashborad'}>
            <DashboardNavs />
            {loading && <Loader />}
            <div className='dashboard w-50'>
                <form className='dashboard-producers-fields' onSubmit={formik.handleSubmit}>
                    <div className='d-flex mb-2'>
                        <Input
                            type={'text'}
                            name='newProducerName'
                            value={formik.values.newProducerName}
                            error={formik.touched.newProducerName && formik.errors.newProducerName}
                            placeholder={'Producer name'}
                            handleChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required

                        />
                        <div className='ml-2 w-25'>
                            <button type='submit' className={'btn btn-info w-100'}>Add producer</button>
                        </div>
                    </div>

                    <div className='w-100'>
                        <TextArea
                            name='newProducerFullData'
                            value={formik.values.newProducerFullData}
                            error={formik.touched.newProducerFullData && formik.errors.newProducerFullData}
                            label={'Producer full data'}
                            placeholder={'Producer full data'}
                            handleChange={formik.handleChange}
                            handleBlur={formik.handleBlur}
                            rows={4}
                            required={true}
                        />
                    </div>

                </form>



                <div className='dashboard-list h-40vh hide-scrollbar'>

                    {producers.map(p => <DashboardListItem
                        key={p.id}
                        item={p}
                        deleteItem={deleteProducer}
                        selectItem={selectProducer}
                        isSelected={p.id === selectedProducer}
                        showEditPopup={() => showEditProducerPopup(p)} />)}
                </div>


                {showPopup && <EditProducerPopup
                    producer={editProducer}
                    closeHandler={() => setShowPopup(false)} />}

            </div>



        </Layout>)
}