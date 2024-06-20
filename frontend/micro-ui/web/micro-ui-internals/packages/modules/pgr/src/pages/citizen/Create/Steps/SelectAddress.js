import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, FormStep, RadioButtons, TextArea, CheckBox, TextInput } from "@upyog/digit-ui-react-components";
import { useDispatch ,useSelector} from "react-redux";
import { useQueryClient } from "react-query";
import { updateComplaintAddress } from "../../../../redux/actions";
const SelectAddress = ({ t, config, onSelect, value }) => {
  const appState = useSelector((state) => state["pgr"]);
  const client = useQueryClient();
  const dispatch = useDispatch();
  const allCities = Digit.Hooks.pgr.useTenants();
  const [landmark, setLandmark] = useState("");
  const cities = value?.pincode ? allCities.filter((city) => city?.pincode?.some((pin) => pin == value["pincode"])) : allCities;
  const pttype = sessionStorage.getItem("type");
  const citynew = sessionStorage.getItem("tenantId");
  const localitynew = sessionStorage.getItem("localityCode");
  let value2 = value;
  const storedData=Digit.SessionStorage.get("ComplaintDetails")
  const [reportingForSomeoneElse, setReportingForSomeoneElse] = useState(storedData?.service?.additionalDetail?.reportingForSomeoneElse || false);
  const [reporterAddress, setReporterAddress] = useState(storedData?.service?.additionalDetail?.setReporterAddress ||  "");
  const [reporterCity, setReporterCity] = useState(storedData?.service?.additionalDetail?.setReporterCity || "");
  const [reporterState, setReporterState] = useState(storedData?.service?.additionalDetail?.setReporterState || "");

  console.log("storedDatastoredDatastoredData",storedData)
  function addComment(e) {
    setLandmark(e.target.value);
  }
  useEffect(()=>{
    console.log("updated appState",appState)
    Digit.SessionStorage.set("appState",appState)
  },[appState])
  const [selectedCity, setSelectedCity] = useState(() => {
    if (pttype == "PT") {
      let filteredcities = cities.filter(city => city.code === citynew);
      if (filteredcities) {
        value2 = filteredcities[0];
      }
      return value2;
    } else {
      const { city_complaint } = value;
      return storedData?.service?.address?.locality ? storedData.service.address.locality :   city_complaint ? city_complaint : null;
    }
  });

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "admin",
    {
      enabled: !!selectedCity,
    },
    t
  );

  const [localities, setLocalities] = useState(null);

  const [selectedLocality, setSelectedLocality] = useState(() => {
    const { locality_complaint } = value;
    return storedData?.service?.additionalDetail?.selectedLocality ? storedData.service.additionalDetail.selectedLocality: locality_complaint ? locality_complaint : null;
  });

  useEffect(async () => {
    if (selectedCity && fetchedLocalities) {
      const { pincode } = value;
      let __localityList = pincode ? fetchedLocalities.filter((city) => city["pincode"] == pincode) : fetchedLocalities;
      await setLocalities(__localityList);
      if (pttype == "PT") {
        let filteredLocalities = __localityList.filter(locality => locality.code === localitynew);
        if (filteredLocalities) {
          setSelectedLocality(filteredLocalities[0]);
        }
      } else {
        setLocalities(__localityList);
      }
    }
  }, [selectedCity, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }
  const submitComplaint = async () => {
let values = Digit.SessionStorage.get("appState")
console.log("vallll",selectedCity,)
let defaultdata = values?.complaints?.response?.ServiceWrappers?.[0]?.service
console.log("defaultdatadefaultdata",defaultdata)
const { code: cityCode, name: city } = selectedCity;
const { code: localityCode, name: localityName } = selectedLocality;
    const data = {
      ...defaultdata,
      address:{...defaultdata.address,
        cityCode,
        city,
        locality:{
          code:localityCode,
          name:localityName,
        },
      landmark
      },
      additionalDetail: {
        ...defaultdata.additionalDetail,
        reportingForSomeoneElse,
        reporterAddress,
        reporterCity,
        reporterState,
        selectedCity:{cityCode,city}
      },
      action:"INITIATE"
    };
console.log("datadatadata",data)
   let dataNew = await dispatch(updateComplaintAddress(data));
    await client.refetchQueries(["complaintsList"]);
  }
  function onSubmit() {
    submitComplaint()
    onSelect({
      city_complaint: selectedCity,
      locality_complaint: selectedLocality,
      landmark,
      reportingForSomeoneElse,
      reporterAddress,
      reporterCity,
      reporterState,
    });
  }

  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={!selectedLocality}>
      <div>
        <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
        {cities?.length < 5 ? (
          <RadioButtons selectedOption={selectedCity} options={cities} optionsKey="i18nKey" onSelect={selectCity} />
        ) : (
          <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="i18nKey" t={t} />
        )}
        {selectedCity && localities && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
        {selectedCity && localities && (
          <React.Fragment>
            {localities?.length < 5 ? (
              <RadioButtons selectedOption={selectedLocality} options={localities} optionsKey="i18nkey" onSelect={selectLocality} />
            ) : (
              <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" option={localities} select={selectLocality} t={t} />
            )}
          </React.Fragment>
        )}
        <CardLabel>Landmark</CardLabel>
        <TextArea name="comment" onChange={addComment} value={landmark} />

        <CheckBox
          label={t("Are you reporting for someone else?")}
          onChange={(e) => setReportingForSomeoneElse(e.target.checked)}
          checked={reportingForSomeoneElse}
          style={{marginBottom:"30px"}}
        />

        {reportingForSomeoneElse && (
          <div>
            <CardLabel>Reporter Address</CardLabel>
            <TextInput name="reporterAddress" value={reporterAddress} onChange={(e) => setReporterAddress(e.target.value)} />
            <CardLabel>Phone Number</CardLabel>
            <TextInput name="reporterCity" value={reporterCity} onChange={(e) => setReporterCity(e.target.value)} />
            <CardLabel>Email Id</CardLabel>
            <TextInput name="reporterState" value={reporterState} onChange={(e) => setReporterState(e.target.value)} />
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default SelectAddress;
