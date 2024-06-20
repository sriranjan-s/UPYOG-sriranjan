import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextArea, CardLabel } from "@upyog/digit-ui-react-components";
import { Dropdown } from "@upyog/digit-ui-react-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { FormComposer } from "../../../../components/FormComposer";
import { createComplaint,createComplaintUpdate } from "../../../../redux/actions";
import { useDispatch ,useSelector} from "react-redux";
const SelectComplaintType = ({ t, config, onSelect, value }) => {
  const storedData=Digit.SessionStorage.get("ComplaintDetails")
  const serviceDefinitions = Digit.GetServiceDefinitions;
  const dispatch = useDispatch();
  const client = useQueryClient();
  const appState = useSelector((state) => state["pgr"]);
  const [complaintType, setComplaintType] = useState(() => {
    const { complaintType } = value;
    return storedData?.service?.additionalDetail?.complaintType ? storedData.service.additionalDetail.complaintType:complaintType ?complaintType:{};
  });
  const [subType, setSubType] = useState(() => {
    const { subType } = value;
    return storedData?.service?.additionalDetail?.subType ? storedData.service.additionalDetail.subType:subType? subType:{};
  });
  const [description,setDescription] =useState(storedData?.service?.description ? storedData.service.description: "")
  const [priorityLevel, setPriorityLevel]=useState(()=>{
    const {priorityLevel}=value;
    return priorityLevel? priorityLevel:{};
  })
  console.log("storedDatastoredDatastoredData",storedData)
  const goNext = () => {
    console.log("complaintType",complaintType)
    sessionStorage.setItem("complaintType",JSON.stringify(complaintType))
    submitComplaint()
    onSelect({ subType , priorityLevel, description});
  };
  useEffect(()=>{
    console.log("updated appState",appState)
    Digit.SessionStorage.set("appState",appState)
  },[appState])

  const textParams = config.texts;
  const valuenew= {
    key  :"PropertyTax",
    name :"Property Tax"}

  const menu = Digit.Hooks.pgr.useComplaintTypes({ stateCode: Digit.ULBService.getCurrentTenantId() });
  const  priorityMenu= 
  [
    {
      "name": "LOW",
      "code": "LOW",
      "active": true
    },
    {
      "name": "MEDIUM",
      "code": "MEDIUM",
      "active": true
    },
    {
      "name": "HIGH",
      "code": "HIGH",
      "active": true
    }

  ]
  const prioritylevel=priorityLevel.code;
  const cities = Digit.Hooks.pgr.useTenants();
  const [subTypeMenu, setSubTypeMenu] = useState([]);
  const pttype=sessionStorage.getItem("type")
  useEffect(()=>{
    (async()=>{
      if (pttype=="PT") {
        setComplaintType(valuenew);
        setSubTypeMenu(await serviceDefinitions.getSubMenu("pg.citya", valuenew, t));
      }
    })();   
  },[]) 
 
  function selectedSubType(value) {
   
    console.log("selectedSubType",value)
    setSubType(value);
  }
  function selectCorrespondenceaddress(e) {
    e.preventDefault()
    console.log("dddddddd",e.target.value)
    setDescription(e.target.value);
  }
  const config1 = [
    {
      head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" id="complaintType" selected={complaintType} select={selectedValue} disable={pttype}/>,
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"),
          isMandatory: true,
          type: "dropdown",
          menu: { ...subTypeMenu },
          populators: <Dropdown option={subTypeMenu} optionKey="name" id="complaintSubType" selected={subType} select={selectedSubType} />,
        },
      ],
     
    },
  ];


  const tenantId = window.Digit.SessionStorage.get("Digit.Citizen.tenantId");
  async function selectedValue(value) {
    if (value.key !== complaintType.key) {
      if (value.key === "Others") {
        setSubType({ name: "" });
        setSubTypeMenu([{ key: "Others", name: t("SERVICEDEFS.OTHERS") }]);
      } else {
        setSubType({ name: "" });
        setComplaintType(value);
        setSubTypeMenu(await serviceDefinitions.getSubMenu("pg.citya", value, t));
      }
    }
  }
  async function selectedPriorityLevel(value){
    sessionStorage.setItem("priorityLevel", JSON.stringify(value))
    setPriorityLevel(value);
    //setPriorityMenu(await serviceDefinitions.getSubMen)
  }

  const submitComplaint = async () => {

    if(storedData)
    {
     
      const data = {
        ...storedData.service,
        description: description,
        additionalDetail: {
          ...storedData.service.additionalDetail,
          complaintType,
          subType
        },
        action:"INITIATE"
      };
      console.log("sssssss",data)
      let dataNew = await dispatch(createComplaintUpdate(data));
      await client.refetchQueries(["complaintsList"]);
    }
    else 
    {

    
      const data = {
        complaintType: subType.key,
        cityCode:"",
        city:"",
        prioritylevel: prioritylevel ,
        description: description,
        district: "",
        region: "",
        localityCode:"",
        localityName:"",
        state: "",
        uploadedImages: "",
        additionalDetail: {
          complaintType,
          subType
        },
        action:"INITIATE"
      };

     let dataNew = await dispatch(createComplaint(data));
      await client.refetchQueries(["complaintsList"]);
    }
  }
console.log("check 122",complaintType,subType,description)
  return (
    <div>
    <FormComposer
    heading={t("ES_CREATECOMPLAINT_NEW_COMPLAINT")}
    config={config1}
    onSubmit={goNext}
    isDisabled={Object.keys(subType).length  <2 ? true : false}
    label={"NEXT"}
  >
         <CardLabel className="card-label-smaller" style={{ color: "#0b0c0c" }}>
          Additional Details
      </CardLabel>
       <TextArea
          name="description"
          id="description"
          value={description}
          onChange={(e) => selectCorrespondenceaddress(e)}
          autoComplete="off"
      
        ></TextArea>
          </FormComposer>
          </div>
  );
};

export default SelectComplaintType;