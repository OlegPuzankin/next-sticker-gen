import firebase from "firebase"
import { useFormik } from "formik"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Layout } from "../components/Layout"
import SelectedGrapeBadge from "../components/SelectedGrapeBadge"
import { InlineComboBox } from "../components/UI/InlineComboBox"
import { InlineInput } from "../components/UI/InlineInput"
import { Loader } from "../components/UI/Loader"
import { Select } from "../components/UI/Select"
import { UserContext } from "../components/UserProvider"
import { getCollection, saveStickerDoc } from "../firebase/firebaseFunctions"
import { SetSubjects } from "../redux/actions"
import {
  AppellationsMap,
  CountriesMap,
  GrapesMap,
  I_Appellation,
  I_Country,
  I_Grape,
  I_Producer,
  I_Region,
  ProducersMap,
  RegionsMap,
  StickerType,
} from "../redux/interfaces"
import { StoreState } from "../redux/reducers"
import * as Yup from "yup"
import { useRouter } from "next/router"
import { InfoPopup } from "../components/InfoPopup"
import { fbInstance } from "../firebase/firebase"
import { Switch } from "../components/UI/Switch"

const regionControlTypes = ["none", "PDO", "PJI"]
const colors = ["червоне", "біле", "рожеве"]

export default function Create() {
  const dispatch = useDispatch()

  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [popup, setPopup] = React.useState<{ showPopup: boolean; msg: string }>(
    { showPopup: false, msg: "" }
  )
  const subjects = useSelector((state: StoreState) => state.stickers.subjects)
  // const editSticker = useSelector((state: StoreState) => state.stickers.quickEditSticker)
  const { user } = React.useContext(UserContext)
  const [grapes, setGrapes] = React.useState<Array<I_Grape>>([])
  const [filteredRegions, setFilteredRegions] = React.useState<Array<I_Region>>(
    []
  )
  const [filteredAppellations, setFilteredAppellations] = React.useState<
    Array<I_Appellation>
  >([])
  const [selectedGrapes, setSelectedGrapes] = React.useState<Array<I_Grape>>([])

  async function saveSticker(values: FormikValuesType) {
    if (router.query.editStickerId) {
      await fbInstance.db
        .doc(`_stickers/${router.query.editStickerId}`)
        .update(getStickerObject(values))
      setPopup({ showPopup: true, msg: "Sticker was updated" })
    } else {
      await saveStickerDoc(getStickerObject(values))
      setPopup({ showPopup: true, msg: "Sticker was created" })
    }
  }
  async function saveAsCopy() {
    await saveStickerDoc(getStickerObject(formik.values))
    setPopup({ showPopup: true, msg: "Sticker was created" })
  }

  function getStickerObject(values: FormikValuesType): StickerType {
    //todo
    // const _selectedGrapes = selectedGrapes.map(grapeId => {
    //     return subjects.grapes.map[grapeId]
    // })

    const _country: I_Country = {
      id: values?.country,
      name: subjects.countries.map[values.country].name,
    }

    const _producer: I_Producer = {
      id: values.producer,
      name: subjects.producers.map[values.producer].name,
      producerFullData:
        subjects.producers.map[values.producer].producerFullData,
    }
    let _region: I_Region = null
    if (formik.values.region) {
      _region = {
        id: values?.region,
        name: subjects.regions.map[values.region].name,
        country: subjects.countries.map[values.country].name,
        countryId: values.country,
      }
    }

    let _appellation: I_Appellation = null
    if (formik.values.appellation) {
      _appellation = {
        id: values?.appellation,
        name: subjects.appellations.map[values.appellation].name,
        region: subjects.regions.map[values.region].name,
        regionId: values.region,
      }
    }
    return {
      alcohol: values.alcohol,
      appellation: _appellation,
      bottlingYear: values.bottlingYear,
      color: values.color,
      country: _country,
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      harvestYear: values.harvestYear,
      lotNumber: values.lotNumber,
      originalTitle: values.originalTitle,
      producer: _producer,
      region: _region,
      regionControl: values.regionControl,
      selectedGrapes: selectedGrapes,
      servingTemperature: values.servingTemperature,
      shelfLifetime: values.shelfLifetime,
      sku: values.sku,
      stickerTitle: values.stickerTitle,
      sugar: values.sugar,
      volume: values.volume,
      barcode: values.barcode,
      authorId: user.id,
      eMark: values.eMark,
      organic: values.organic,
    }
  }

  const initialValues = {
    originalTitle: "",
    stickerTitle: "",
    alcohol: "13",
    appellation: "",
    bottlingYear: "2020-10-01",
    color: "червоне",
    country: "",

    harvestYear: "",
    lotNumber: "вказано на пляшці",
    producer: "",
    region: "",
    regionControl: "none",
    servingTemperature: "16",
    shelfLifetime: "3",
    sku: "sku",
    sugar: "4",
    volume: "750",
    barcode: "",
    eMark: false,
    organic: false,

    pickedGrape: "",
  }
  type FormikValuesType = typeof initialValues

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      originalTitle: Yup.string().required("Required"),
      stickerTitle: Yup.string().required("Required"),
      producer: Yup.string().required("Required"),
      lotNumber: Yup.string().required("Required"),
      harvestYear: Yup.number()
        // .required("Required")
        .moreThan(1989, "type number more than 1990")
        .lessThan(new Date().getFullYear() + 1),
      bottlingYear: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
    }),
    onSubmit: (values) => saveSticker(values),
  })

  //initial load
  React.useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { array: countries, map: countriesDoc } = await getCollection<
        I_Country,
        CountriesMap
      >("_countries/data", ["name"], "name")
      const { array: producers, map: producersDoc } = await getCollection<
        I_Producer,
        ProducersMap
      >("_producers/data", ["name", "producerFullData"], "name")
      const { array: grapes, map: grapesDoc } = await getCollection<
        I_Grape,
        GrapesMap
      >("_grapes/data", ["name"], "name")
      const { array: regions, map: regionsDoc } = await getCollection<
        I_Region,
        RegionsMap
      >("_regions/data", ["name", "country", "countryId"], "name")
      const { array: appellations, map: appellationDoc } = await getCollection<
        I_Appellation,
        AppellationsMap
      >("_appellations/data", ["name", "region", "regionId"], "name")

      dispatch(
        SetSubjects({
          countries: { array: countries, map: countriesDoc },
          producers: { array: producers, map: producersDoc },
          regions: { array: regions, map: regionsDoc },
          appellations: { array: appellations, map: appellationDoc },
          grapes: { array: grapes, map: grapesDoc },
        })
      )
      setGrapes(grapes)

      if (router.query.editStickerId) await loadSticker(grapes)
      // if (editSticker)
      //     await loadSticker(grapes, editSticker)

      setLoading(false)
    }
    //load edited sticker function. Grapes arg using for filtering whole list of grapes
    /**
     * @param grapes Information about the user.
     */
    async function loadSticker(grapes: Array<I_Grape>) {
      const editSticker = await fbInstance.db
        .doc(`_stickers/${router.query.editStickerId}`)
        .get()
        .then((docSnapshot) => docSnapshot.data() as StickerType)

      formik.setValues({
        originalTitle: editSticker.originalTitle,
        stickerTitle: editSticker.stickerTitle,
        alcohol: editSticker.alcohol,
        appellation: editSticker.appellation?.id || "",
        bottlingYear: editSticker.bottlingYear,
        color: editSticker.color,
        country: editSticker.country.id,

        harvestYear: editSticker.harvestYear,
        lotNumber: editSticker.lotNumber,
        producer: editSticker.producer.id,
        region: editSticker.region?.id || "",
        regionControl: editSticker.regionControl,
        servingTemperature: editSticker.servingTemperature,
        shelfLifetime: editSticker.shelfLifetime,
        sku: editSticker.sku,
        sugar: editSticker.sugar,
        volume: editSticker.volume,
        barcode: editSticker.barcode,
        eMark: editSticker.eMark || false,
        organic: editSticker.organic || false,

        pickedGrape: "",
      })

      setSelectedGrapes(editSticker.selectedGrapes)

      //remove selected grapes from whole grapes list
      editSticker.selectedGrapes.forEach((sg) => {
        grapes.forEach((g, idx) => {
          if (g.id === sg.id) {
            grapes.splice(idx, 1)
          }
        })
        setGrapes(grapes)
      })
      //filter regions and appellations according to loaded sticker
      if (!editSticker.region) {
        return
      }
      if (editSticker.region) {
        const data = subjects.regions.array.filter((r) => {
          return r.countryId === editSticker.region.countryId
        })
        setFilteredRegions(data)
      }
      if (editSticker.appellation) {
        const data = subjects.appellations.array.filter((r) => {
          return r.regionId === editSticker.appellation.regionId
        })
        setFilteredAppellations(data)
      }
    }

    loadData()
  }, [])
  //load editing sticker to form

  //handle pick grape
  React.useEffect(() => {
    if (!formik.values.pickedGrape) return
    const selectedGrape: I_Grape = {
      id: formik.values.pickedGrape,
      name: subjects.grapes.map[formik.values.pickedGrape].name,
    }
    setSelectedGrapes([...selectedGrapes, selectedGrape])

    const data = grapes.filter((g) => g.id !== formik.values.pickedGrape)
    setGrapes(data)
  }, [formik.values.pickedGrape])

  function removeGrapeFromList(grapeId: string) {
    const newSelectedGrapes = selectedGrapes.filter((g) => g.id !== grapeId)
    setSelectedGrapes(newSelectedGrapes)

    const grape: I_Grape = {
      id: grapeId,
      name: subjects.grapes.map[grapeId].name,
    }
    grapes.push(grape)
    grapes.sort((a, b) => (a.name > b.name ? 1 : -1))
    setGrapes(grapes)
    formik.setFieldValue("pickedGrape", "")
  }

  async function handleSelectCountry(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    const name = e.target.name
    formik.setFieldValue(name, value)
    formik.setFieldValue("region", "")
    formik.setFieldValue("appellation", "")

    const data = subjects.regions.array.filter((r) => {
      return r.countryId === value
    })

    setFilteredRegions(data)
    setFilteredAppellations([])
  }
  async function handleSelectRegion(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    const name = e.target.name
    formik.setFieldValue(name, value)

    formik.setFieldValue("appellation", "")

    const data = subjects.appellations.array.filter((a) => {
      return a.regionId === value
    })
    setFilteredAppellations(data)
  }

  async function clearForm() {
    await router.push("/create")
    formik.resetForm()
    setSelectedGrapes([])
  }

  // console.log("ORGANIC", formik.values.organic)
  // console.log("EMark", formik.values.eMark)

  return (
    <Layout title={"Sticker creation"}>
      {loading && <Loader />}
      <div className="py-2">
        <form className="form-container" onSubmit={formik.handleSubmit}>
          <div className="original-title">
            <InlineInput
              inputAttributes={{
                name: "originalTitle",
                value: formik.values.originalTitle,
                type: "text",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Original title",
              }}
              labelWidth={150}
              label={"Original title"}
              error={
                formik.touched.originalTitle && formik.errors.originalTitle
              }
            />
          </div>

          <div className="save-btn">
            <button
              disabled={selectedGrapes.length === 0}
              type="submit"
              className={"btn btn-info w-100"}
            >
              {router.query.editStickerId ? "Update" : "Save"}
            </button>
          </div>

          {router.query.editStickerId && (
            <div className="save-copy-btn">
              <button
                onClick={saveAsCopy}
                disabled={selectedGrapes.length === 0}
                type="button"
                className={"btn btn-primary w-100"}
              >
                Save as new
              </button>
            </div>
          )}

          <div className="sticker-title">
            <InlineInput
              inputAttributes={{
                name: "stickerTitle",
                value: formik.values.stickerTitle,
                type: "text",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Sticker Title",
              }}
              labelWidth={150}
              label={"Sticker Title"}
              error={formik.touched.stickerTitle && formik.errors.stickerTitle}
            />
          </div>

          <div className="clear-form-btn">
            <button
              type="button"
              onClick={clearForm}
              className={"btn btn-warning w-100"}
            >
              Clear form
            </button>
          </div>

          <div className="basic-parameters">
            <div className="column-label">Basic parameters</div>

            <InlineComboBox
              label={"Wine's color"}
              name={"color"}
              value={formik.values.color}
              items={colors.map((color) => {
                return { value: color, displayText: color }
              })}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              firstOption={"Select color"}
              labelWidth={150}
              error={formik.touched.color && formik.errors.color}
            />

            <InlineInput
              inputAttributes={{
                name: "volume",
                value: formik.values.volume,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Volume",
              }}
              labelWidth={150}
              label={"Volume, ml"}
              error={formik.touched.volume && formik.errors.volume}
            />
            <InlineInput
              inputAttributes={{
                name: "alcohol",
                value: formik.values.alcohol,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Alcohol",
              }}
              labelWidth={150}
              label={"Alcohol, %"}
              error={formik.touched.alcohol && formik.errors.alcohol}
            />
            <InlineInput
              inputAttributes={{
                name: "sugar",
                value: formik.values.sugar,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Sugar",
              }}
              labelWidth={150}
              label={"Sugar, g/per L"}
              error={formik.touched.sugar && formik.errors.sugar}
            />
            <InlineInput
              inputAttributes={{
                name: "shelfLifetime",
                value: formik.values.shelfLifetime,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Shelf lifetime",
              }}
              labelWidth={150}
              label={"Shelf life, yrs"}
              error={
                formik.touched.shelfLifetime && formik.errors.shelfLifetime
              }
            />
            <InlineInput
              inputAttributes={{
                name: "servingTemperature",
                value: formik.values.servingTemperature,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Serving temp",
              }}
              labelWidth={150}
              label={"Serving temp, °С"}
              error={
                formik.touched.servingTemperature &&
                formik.errors.servingTemperature
              }
            />
            <InlineInput
              inputAttributes={{
                name: "harvestYear",
                value: formik.values.harvestYear,
                type: "number",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "from 1990 to current year",
                min: 1990,
                max: new Date().getFullYear(),
              }}
              labelWidth={150}
              label={"Harvest year"}
              error={formik.touched.harvestYear && formik.errors.harvestYear}
            />
            <InlineInput
              inputAttributes={{
                name: "bottlingYear",
                value: formik.values.bottlingYear,
                type: "date",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Bottling date",
              }}
              labelWidth={150}
              label={"Bottling date"}
              error={formik.touched.bottlingYear && formik.errors.bottlingYear}
            />
            <InlineInput
              inputAttributes={{
                name: "lotNumber",
                value: formik.values.lotNumber,
                type: "text",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Lot Number",
              }}
              labelWidth={150}
              label={"Lot number"}
              error={formik.touched.lotNumber && formik.errors.lotNumber}
            />
            <InlineInput
              inputAttributes={{
                name: "sku",
                value: formik.values.sku,
                type: "text",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "SKU",
              }}
              labelWidth={150}
              label={"SKU"}
              error={formik.touched.sku && formik.errors.sku}
            />
            <InlineInput
              inputAttributes={{
                name: "barcode",
                value: formik.values.barcode,
                type: "text",
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                placeholder: "Barcode ean-13",
              }}
              labelWidth={150}
              label={"Barcode EAN-13"}
              error={formik.touched.barcode && formik.errors.barcode}
            />
            <div className="d-flex bg-secondary px-3 py-2 text-white">
              <div className="mr-4">
                <Switch
                  inputAttributes={{
                    name: "organic",
                    checked: formik.values.organic,
                    onChange: formik.handleChange,
                  }}
                  label={"Organic"}
                />
              </div>

              <Switch
                inputAttributes={{
                  name: "eMark",
                  checked: formik.values.eMark,
                  onChange: formik.handleChange,
                }}
                label={"Insert Emark"}
              />
            </div>
          </div>

          <div className="region-parameters">
            <div className="column-label">Region parameters</div>
            <InlineComboBox
              label={"Producer"}
              name={"producer"}
              value={formik.values.producer}
              items={subjects.producers.array.map((p) => {
                return { value: p.id, displayText: p.name }
              })}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              firstOption={"Select producer"}
              labelWidth={120}
              error={formik.touched.producer && formik.errors.producer}
            />
            <InlineComboBox
              label={"Origin control"}
              name={"regionControl"}
              value={formik.values.regionControl}
              items={regionControlTypes.map((rc) => {
                return { value: rc, displayText: rc }
              })}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              firstOption={"Select region control"}
              labelWidth={120}
              error={
                formik.touched.regionControl && formik.errors.regionControl
              }
            />
            <InlineComboBox
              label={"Country"}
              name={"country"}
              value={formik.values.country}
              items={subjects?.countries?.array.map((c) => {
                return { value: c.id, displayText: c.name }
              })}
              handleChange={handleSelectCountry}
              onBlur={formik.handleBlur}
              firstOption={"Select country"}
              labelWidth={120}
              error={formik.touched.country && formik.errors.country}
            />
            {formik.values.country && filteredRegions.length > 0 && (
              <InlineComboBox
                label={"Region"}
                name={"region"}
                value={formik.values.region}
                items={filteredRegions.map((r) => {
                  return { value: r.id, displayText: r.name }
                })}
                handleChange={handleSelectRegion}
                onBlur={formik.handleBlur}
                firstOption={"Select region"}
                labelWidth={120}
                error={formik.touched.region && formik.errors.region}
              />
            )}
            {formik.values.region && filteredAppellations.length > 0 && (
              <InlineComboBox
                label={`Appellation`}
                name={"appellation"}
                value={formik.values.appellation}
                items={filteredAppellations.map((a) => {
                  return { value: a.id, displayText: a.name }
                })}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
                firstOption={"Select appellation"}
                labelWidth={120}
                error={formik.touched.appellation && formik.errors.appellation}
              />
            )}
          </div>

          <div className="grapes-data">
            <div className="column-label">Grapes</div>

            <Select
              inputAttributes={{
                name: "pickedGrape",
                size: 10,
                onBlur: formik.handleBlur,
                onChange: formik.handleChange,
              }}
              items={grapes.map(({ id, name }) => {
                return { value: id, displayText: name }
              })}
            />

            {selectedGrapes?.length > 0 && (
              <div className="font-weight-bold">selected grapes:</div>
            )}

            {subjects.grapes.array.length > 0 &&
              selectedGrapes?.length > 0 &&
              selectedGrapes.map((grape) => {
                return (
                  <SelectedGrapeBadge
                    key={grape.id}
                    grape={grape}
                    removeGrapeFromList={removeGrapeFromList}
                  />
                )
              })}
          </div>
        </form>

        {popup.showPopup && (
          <InfoPopup
            message={popup.msg}
            closeHandler={() => setPopup({ showPopup: false, msg: "" })}
          />
        )}
      </div>
    </Layout>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {

//     return {
//         redirect: {
//             destination: '/',
//             permanent: false
//         }
//     }

//     // return {
//     //     props: {}
//     // }

// }
