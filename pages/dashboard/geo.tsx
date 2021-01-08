import React from 'react';
import { DashboardNavs } from '../../components/DashboardNavs';
import { DashboardListItem } from '../../components/DashboardListItem';
import { Layout } from '../../components/Layout';
import { fbInstance } from '../../firebase/firebase';
import { AppellationsMap, CountriesMap, Item, I_Appellation, I_Country, I_Producer, I_Region, RegionsMap } from '../../redux/interfaces';
import { Input } from '../../components/UI/Input';
import { useFormik } from 'formik';
import firebase from 'firebase';
import { fil } from 'date-fns/esm/locale';
import { EditNamePopup } from '../../components/EditNamePopup';

interface EditItem {
    item: Item,
    firestorePath: string,
    editField: string

}

export default function DashboardGeo() {
    const [loading, setLoading] = React.useState(true)

    const [countries, setCountries] = React.useState<Array<I_Country>>([])
    const [countriesMap, setCountriesMap] = React.useState<CountriesMap>()
    const [selectedCountry, setSelectedCountry] = React.useState<string>('')

    const [regions, setRegions] = React.useState<Array<I_Region>>([])
    const [regionsMap, setRegionsMap] = React.useState<RegionsMap>()
    const [filteredRegions, setFilteredRegions] = React.useState<Array<I_Region>>([])
    const [selectedRegion, setSelectedRegion] = React.useState<string>('')

    const [appellations, setAppellations] = React.useState<Array<I_Appellation>>([])
    // const [appellationsMap, setAppellationsMap] = React.useState<AppellationsMap>()
    const [filteredAppellations, setFilteredAppellations] = React.useState<Array<I_Appellation>>([])
    const [selectedAppellation, setSelectedAppellation] = React.useState<string>('')

    const [showPopup, setShowPopup] = React.useState<boolean>(false)
    const [editItem, setEditItem] = React.useState<EditItem>()

    const formik = useFormik({
        initialValues: {
            newCountryName: '',
            newRegionName: '',
            newAppellationName: ''

        },
        onSubmit: (values) => { }

    })
    //track data
    React.useEffect(() => {
        let unsubscribeCountries: Function;
        let unsubscribeRegions: Function;
        let unsubscribeAppellations: Function;
        async function load() {

            unsubscribeCountries = fbInstance.db.doc('_countries/data').onSnapshot(doc => {
                setLoading(true)
                const countriesMap = doc.data()

                const data: Array<I_Country> = []
                for (const [key, value] of Object.entries(countriesMap)) {
                    data.push({ name: value.name, id: key })
                }
                data.sort((a, b) => a.name > b.name ? 1 : -1)
                setCountries(data)
                setCountriesMap(countriesMap)
                setLoading(false)

            })
            unsubscribeRegions = fbInstance.db.doc('_regions/data').onSnapshot(doc => {
                setLoading(true)
                const regionsMap = doc.data()

                const data: Array<I_Region> = []
                for (const [key, value] of Object.entries(regionsMap)) {
                    data.push({ name: value.name, id: key, country: value.country, countryId: value.countryId })
                }
                data.sort((a, b) => a.name > b.name ? 1 : -1)
                setRegions(data)
                setRegionsMap(regionsMap)
                setLoading(false)
            })
            unsubscribeAppellations = fbInstance.db.doc('_appellations/data').onSnapshot(doc => {
                setLoading(true)
                const appellationsMap = doc.data()

                const data: Array<I_Appellation> = []
                for (const [key, value] of Object.entries(appellationsMap)) {
                    data.push({
                        name: value.name, id: key, region: value.region, regionId: value.regionId
                    })
                }
                data.sort((a, b) => a.name > b.name ? 1 : -1)
                setAppellations(data)
                // setAppellationsMap(appellationsMap)
                setLoading(false)

            })
        }
        load()

        return function cleanup() {
            unsubscribeCountries()
            unsubscribeRegions()
            unsubscribeAppellations()
        }

    }, [])
    //update regions after editing region
    React.useEffect(() => {
        const data = regions.filter(r => {
            return r.countryId === selectedCountry
        })
        setFilteredRegions(data)
    }, [regions])
    React.useEffect(() => {
        const data = appellations.filter(a => {
            return a.regionId === selectedRegion
        })
        setFilteredAppellations(data)
    }, [appellations])

    async function addCountry() {
        const id = fbInstance.db.collection('_countries').doc().id
        await fbInstance.db.doc('_countries/data').update({ [id]: { name: formik.values.newCountryName } })
        formik.setFieldValue('newCountryName', '')
    }

    async function deleteCountry(countryId: string) {
        if (filteredRegions.length > 0) {
            alert('Country has nested regions and could not be removed')
            return
        }
        let confirmDelete = confirm("Delete item?");
        if (confirmDelete) {
            await fbInstance.db.doc('_countries/data').update({ [countryId]: firebase.firestore.FieldValue.delete() })
            setSelectedCountry('')
            setSelectedRegion('')
        }
    }

    async function addRegion() {
        const id = fbInstance.db.collection('_regions').doc().id
        const newRegion = { name: formik.values.newRegionName, countryId: selectedCountry, country: countriesMap[selectedCountry].name }
        await fbInstance.db.doc('_regions/data')
            .update({ [id]: newRegion })
        setFilteredRegions([...filteredRegions, { id, ...newRegion }])
        formik.setFieldValue('newRegionName', '')
    }
    async function deleteRegion(regionId: string) {
        if (filteredAppellations.length > 0) {
            alert('Region has nested appellations and could not be removed')
            return
        }
        let confirmDelete = confirm("Delete item?");
        if (confirmDelete) {
            await fbInstance.db.doc('_regions/data').update({ [regionId]: firebase.firestore.FieldValue.delete() })
            setSelectedRegion('')
        }

    }
    async function addAppellation() {
        const id = fbInstance.db.collection('_appellations').doc().id
        const newAppellation = { name: formik.values.newAppellationName, regionId: selectedRegion, region: regionsMap[selectedRegion].name }
        await fbInstance.db.doc('_appellations/data')
            .update({ [id]: newAppellation })
        setFilteredAppellations([...filteredAppellations, { id, ...newAppellation }])
        formik.setFieldValue('newAppellationName', '')
    }

    async function deleteAppellation(appellationId: string) {

        let confirmDelete = confirm("Delete item?");
        if (confirmDelete) {
            await fbInstance.db.doc('_appellations/data').update({ [appellationId]: firebase.firestore.FieldValue.delete() })
        }

    }

    function selectCountry(countryId: string) {
        setSelectedCountry(countryId)

        const data = regions.filter(r => {
            return r.countryId === countryId
        })

        setFilteredRegions(data)
        setSelectedRegion('')
        setSelectedAppellation('')
        setFilteredAppellations([])
    }
    function selectRegion(regionId: string) {
        setSelectedRegion(regionId)

        const data = appellations.filter(a => {
            return a.regionId === regionId
        })

        setFilteredAppellations(data)

    }
    function selectAppellation(appellationId: string) {
        setSelectedAppellation(appellationId)



    }

    function initEditPopup(item: Item, firestorePath: string, editField: string) {
        setEditItem({ item, firestorePath, editField })
        setShowPopup(true)
    }

    return (
        <Layout title={'Dashborad'}>
            <DashboardNavs />


            <div className='dashboard-geo'>
                <div >
                    <div className='d-flex py-2'>
                        <div className='w-75'>
                            <Input
                                type={'text'}
                                name='newCountryName'
                                value={formik.values.newCountryName}
                                error={formik.touched.newCountryName && formik.errors.newCountryName}
                                placeholder={'Type country'}
                                handleChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                        </div>

                        <div className='ml-2 w-25'>
                            <button
                                type='button'
                                onClick={addCountry}
                                className={'btn btn-info w-100 h-100 fs-sm font-weight-bold'}>Add country</button>
                        </div>

                    </div>

                    <div className='list hide-scrollbar'>
                        {countries.map(c => <DashboardListItem
                            selectItem={selectCountry}
                            isSelected={c.id === selectedCountry}
                            key={c.id}
                            item={c}
                            deleteItem={deleteCountry}
                            showEditPopup={() => initEditPopup(c, '_countries/data', 'Edit country name')} />)}
                    </div>


                </div>

                <div className=''>
                    {selectedCountry && <div className='d-flex py-2'>
                        <div className='w-75'>
                            <Input
                                type={'text'}
                                name='newRegionName'
                                value={formik.values.newRegionName}
                                error={formik.touched.newRegionName && formik.errors.newRegionName}
                                placeholder={`Add region to ${countriesMap[selectedCountry]?.name}`}
                                handleChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                        </div>

                        <div className='ml-2 w-25'>
                            <button
                                onClick={addRegion}
                                type='button'
                                className='btn btn-info w-100 h-100 fs-sm font-weight-bold'>Add region</button>
                        </div>

                    </div>}
                    <div className='list hide-scrollbar'>
                        {filteredRegions.map(r => <DashboardListItem
                            selectItem={selectRegion}
                            isSelected={r.id === selectedRegion}
                            key={r.id}
                            item={r}
                            deleteItem={deleteRegion}
                            showEditPopup={() => initEditPopup(r, '_regions/data', 'Edit region name')} />)}
                    </div>
                </div>

                <div >
                    {selectedRegion && <div className='d-flex py-2'>
                        <div className='w-75'>
                            <Input
                                type={'text'}
                                name='newAppellationName'
                                value={formik.values.newAppellationName}
                                error={formik.touched.newAppellationName && formik.errors.newAppellationName}
                                placeholder={`Add appellation to ${regionsMap[selectedRegion]?.name}`}
                                handleChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <div className='ml-2 w-25'>
                            <button
                                onClick={addAppellation}
                                type='button'
                                className={'btn btn-info w-100 h-100 fs-sm font-weight-bold'}>Add appell</button>
                        </div>

                    </div>}
                    <div className='list hide-scrollbar'>
                        {filteredAppellations.map(a => <DashboardListItem
                            selectItem={selectAppellation}
                            isSelected={a.id === selectedAppellation}
                            key={a.id}
                            item={a}
                            deleteItem={deleteAppellation}
                            showEditPopup={() => initEditPopup(a, '_appellations/data', 'Edit appellation name')} />)}
                    </div>


                </div>
            </div>

            {showPopup && <EditNamePopup
                editField={editItem.editField}
                firestorePath={editItem.firestorePath}
                item={editItem.item}
                closeHandler={() => setShowPopup(false)} />}

        </Layout>)
}