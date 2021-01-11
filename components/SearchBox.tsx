import { FormikConfig, FormikProps, FormikValues, useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { fbInstance } from "../firebase/firebase";
import { getCollection, loadCollection } from "../firebase/firebaseFunctions";
import {
  CountriesMap,
  I_Country,
  I_Producer,
  I_Region,
  ProducersMap,
  RegionsMap,
} from "../redux/interfaces";
import { SearchDropDown } from "./SearchDropDown";
import { ComboBoxWithButton } from "./UI/ComboBoxWithButton";
import { CustomCBGwithButton } from "./UI/CustomCBGWithButton";
import { InlineComboBox } from "./UI/InlineComboBox";
import { InputWithButton } from "./UI/InputWithButton";

interface Props {
  // formik: FormikProps<searchBoxFormikValues>
  // subjects: SubjectsType
  // changeQuery: Function
}

export function SearchBox() {
  const router = useRouter();
  const [countries, setCountries] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [producers, setProducers] = React.useState([]);
  const [filteredRegions, setFilteredRegions] = React.useState<Array<I_Region>>(
    []
  );
  const [searchType, setSearchType] = React.useState("sku");

  React.useEffect(() => {
    async function load() {
      const { array: countries } = await getCollection<I_Country, CountriesMap>(
        "_countries/data",
        ["name"],
        "name"
      );
      const { array: producers } = await getCollection<
        I_Producer,
        ProducersMap
      >("_producers/data", ["name"], "name");
      const { array: regions } = await getCollection<I_Region, RegionsMap>(
        "_regions/data",
        ["name", "country", "countryId"],
        "name"
      );
      setCountries(countries);
      setProducers(producers);
      setRegions(regions);
    }
    load();
  }, []);

  //FORMIK
  const formik = useFormik({
    initialValues: {
      searchType: "",
      producer: "",
      sku: "",
      country: "",
      region: "",
    },
    onSubmit: (values) => {},
  });

  const searchTypes = [
    { value: "producer", displayText: "Search by producer" },
    { value: "sku", displayText: "Search by SKU" },
    { value: "countryAndRegion", displayText: "Search by region" },
    { value: "recent", displayText: "Find recent stickers" },
  ];

  async function changeQuery(queryString: string) {
    await router.push(`/stickers/${queryString}`, undefined, { shallow: true });
  }

  function getQueryStringByRegion() {
    if (formik.values.country && formik.values.region) {
      return `?queryType=searchByRegion&regionId=${formik.values.region}`;
    } else {
      return `?queryType=searchByCountry&countryId=${formik.values.country}`;
    }
  }
  //handle find recent stickers
  React.useEffect(() => {
    if (searchType === "recent") {
      changeQuery(`?queryType=getRecent`);
      return;
    }
  }, [searchType]);

  //populate regions state
  React.useEffect(() => {
    async function populateRegions() {
      if (formik.values.country === "") {
        formik.setFieldValue("region", "");
        setFilteredRegions([]);
        return;
      }

      const data = regions.filter((r) => {
        return r.countryId === formik.values.country;
      });
      setFilteredRegions(data);
    }
    populateRegions();
  }, [formik.values.country]);

  return (
    <div className="search-box">
      <SearchDropDown handleSelect={setSearchType} />
      {searchType === "producer" && (
        <ComboBoxWithButton
          name="producer"
          items={producers.map((p) => {
            return { value: p.id, displayText: p.name };
          })}
          error={formik.errors.producer}
          touched={formik.touched.producer}
          buttonContent={"Search"}
          firstOption={"Select producer"}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onClickHandler={() =>
            changeQuery(
              `?queryType=searchByProducer&producerId=${formik.values.producer}`
            )
          }
        />
      )}

      {searchType === "sku" && (
        <InputWithButton
          name="sku"
          value={formik.values.sku}
          error={formik.errors.searchType}
          touched={formik.touched.sku}
          buttonContent={"Search by SKU"}
          placeholder={"Type SKU number"}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onClickHandler={() =>
            changeQuery(`?queryType=searchBySKU&sku=${formik.values.sku}`)
          }
        />
      )}

      {searchType === "countryAndRegion" && (
        <CustomCBGwithButton
          label={"Country/region"}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          nameFirst="country"
          valueFirst={formik.values.country}
          itemsFirst={countries.map(({ id, name }) => {
            return { value: id, displayText: name };
          })}
          nameSecond="region"
          valueSecond={formik.values.region}
          itemsSecond={filteredRegions.map(({ id, name }) => {
            return { value: id, displayText: name };
          })}
          onClickHandler={() => changeQuery(getQueryStringByRegion())}
          buttonContent="Search"
        />
      )}
    </div>
  );
}
