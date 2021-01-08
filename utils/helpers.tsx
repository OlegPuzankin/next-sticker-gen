export async function populateRegions(country: string, setRegions, setMapRegions, mapRegions, setAppellations?) {
    debugger
    if (country === '') {
        setRegions([])
        setAppellations([])
        return
    }
    if (mapRegions[country]) {
        setRegions(mapRegions[country])
        setAppellations([])
        return
    }


    // const regionsRef = await fbInstance.db.collection('regions').where('countryId', '==', formik.values.country).get()

    // // const regionsRef = await fbInstance.db.collection(`_countries/${formik.values.country}/regions`).get()
    // const regions = regionsRef.docs.map(s => {
    //     return { id: s.id, ...s.data() }
    // })
    // setRegions(regions)
    // setAppellations([])
    // setMapRegions({ ...mapRegions, [formik.values.country]: regions })

}