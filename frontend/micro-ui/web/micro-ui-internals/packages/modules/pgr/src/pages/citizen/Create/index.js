import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import merge from "lodash.merge";
import { useDispatch,useSelector } from "react-redux";
import  {createComplaint ,createComplaintFull} from "../../../redux/actions/index";
import { PGR_CITIZEN_COMPLAINT_CONFIG, PGR_CITIZEN_CREATE_COMPLAINT } from "../../../constants/Citizen";
import Response from "./Response";

import { config as defaultConfig } from "./defaultConfig";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";

export const CreateComplaint = () => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const registry = useContext(ComponentProvider);
  const dispatch = useDispatch();
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});
  // const [customConfig, setConfig] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_COMPLAINT_CONFIG, {});
  const config = useMemo(() => merge(defaultConfig, Digit.Customizations.PGR.complaintConfig), [Digit.Customizations.PGR.complaintConfig]);
  const [paramState, setParamState] = useState(params);
  const [nextStep, setNextStep] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const [rerender, setRerender] = useState(0);
  const client = useQueryClient();
  const appState = useSelector((state) => state["pgr"]);
  useEffect(() => {
    setCanSubmit(false);
  }, []);

  useEffect(() => {
    setParamState(params);
    if (nextStep === null) {
      console.log("paramsparamsparams",params)
      wrapperSubmit();
    } else {
      history.push(`${match.path}/${nextStep}`);
    }
  }, [params, nextStep]);

  const goNext = () => {
    const currentPath = pathname.split("/").pop();

    let { nextStep } = config.routes[currentPath];
    let compType = Digit.SessionStorage.get(PGR_CITIZEN_CREATE_COMPLAINT);
    if (nextStep === "sub-type" && compType.complaintType.key === "Others") {
      setParams({
        ...params,
        complaintType: { key: "Others", name: t("SERVICEDEFS.OTHERS") },
        subType: { key: "Others", name: t("SERVICEDEFS.OTHERS") },
      });
      nextStep = config.routes[nextStep].nextStep;
    }
    setNextStep(nextStep);
  };

  const wrapperSubmit = () => {
    if (!canSubmit) {
      setCanSubmit(true);
      submitComplaint();
    }
  };
  const submitComplaint = async () => {

       const { uploadedImages } = paramState;
      // const { code: cityCode, name: city } = city_complaint;
      // const { code: localityCode, name: localityName } = locality_complaint;
      // const storedpropertyid =sessionStorage.getItem("propertyid")
      const _uploadImages = uploadedImages?.map((url) => ({
        documentType: "PHOTO",
        fileStoreId: url,
        documentUid: "",
        additionalDetails: {},
      }));
      let values = Digit.SessionStorage.get("appState")

      let defaultdata = values?.complaints?.response?.ServiceWrappers?.[0]?.service
      console.log("defaultdatadefaultdata",defaultdata)
      const data = {
        ...defaultdata,
        additionalDetail: {
          ...defaultdata.additionalDetail,
          _uploadImages,
        },
        action:"APPLY"
      };

     let dataNew = await dispatch(createComplaintFull(data));
      await client.refetchQueries(["complaintsList"]);
      
      console.log("dataNewdataNew",dataNew,appState)
      debugger
      history.push(`${match.path}/response`);
    
  };
useEffect(()=>{
  console.log("updated appState",appState)
},[appState])
  const handleSelect = (data) => {
    let c = JSON.parse(sessionStorage.getItem("complaintType"))
    if(data?.subType)
    {
      
      let data2 ={"complaintType":c}
      console.log("handleSelect",data,data2)
      setParams({ ...params, ...data ,...data2 });
      goNext();
    }
    else {
      setParams({ ...params, ...data });
      goNext();
    }
  };

  const handleSkip = () => {
    goNext();
  };

  if (isLoading) return null;



  return (
    <Switch>
      {Object.keys(config.routes).map((route, index) => {
        const { component, texts, inputs } = config.routes[route];
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${route}`} key={index}>
            <Component config={{ texts, inputs }} onSelect={handleSelect} onSkip={handleSkip} value={params} t={t} />
          </Route>
        );
      })}
      <Route path={`${match.path}/response`}>
        <Response match={match} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};
