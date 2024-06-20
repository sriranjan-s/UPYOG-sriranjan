import { CREATE_COMPLAINT } from "./types";

export  const createComplaint = ({
  cityCode,
  complaintType,
  priorityLevel,
  description,
  landmark,
  city,
  district,
  region,
  state,
  pincode,
  localityCode,
  localityName,
  uploadedImages,
  mobileNumber,
  name,
  emailId,
  additionalDetail,
  action
}) => async (dispatch, getState) => {
  const response = await Digit.Complaint.create({
    cityCode,
    complaintType,
    description,
    landmark,
    city,
    district,
    region,
    state,
    pincode,
    localityCode,
    localityName,
    uploadedImages,
    mobileNumber,
    name,
    emailId,
    additionalDetail,
    action
  });
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};

export  const updateComplaintAddress = ({
  accountId,
  active,
  auditDetails,
  citizen,
  description,
  id,
  serviceCode,
  serviceRequestId,
  source,
  tenantId,
  address,
  additionalDetail,
  action
}) => async (dispatch, getState) => {
  console.log("")
  const response = await Digit.Complaint.update({
    accountId,
    active,
    auditDetails,
    citizen,
    description,
    id,
    serviceCode,
    serviceRequestId,
    source,
    tenantId,
    address,
    additionalDetail,
    action
  });
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};
export  const updateComplaintType = ({
  cityCode,
  complaintType,
  description,
  landmark,
  city,
  district,
  region,
  state,
  pincode,
  localityCode,
  localityName,
  uploadedImages,
  mobileNumber,
  name,
  emailId,
  additionalDetails,
  action
}) => async (dispatch, getState) => {
  const response = await Digit.Complaint.update({
    cityCode,
    complaintType,
    priorityLevel,
    description,
    landmark,
    city,
    district,
    region,
    state,
    pincode,
    localityCode,
    localityName,
    uploadedImages,
    mobileNumber,
    name,
    emailId,
    additionalDetails,
    action
  });
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};
export  const createComplaintFull = ({
  accountId,
  active,
  auditDetails,
  citizen,
  description,
  id,
  serviceCode,
  serviceRequestId,
  source,
  tenantId,
  address,
  additionalDetail,
  action
}) => async (dispatch, getState) => {
  console.log("")
  const response = await Digit.Complaint.update({
    accountId,
    active,
    auditDetails,
    citizen,
    description,
    id,
    serviceCode,
    serviceRequestId,
    source,
    tenantId,
    address,
    additionalDetail,
    action
  });
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};

export  const createComplaintUpdate = ({
  accountId,
  active,
  auditDetails,
  citizen,
  description,
  id,
  serviceCode,
  serviceRequestId,
  source,
  tenantId,
  address,
  additionalDetail,
  action
}) => async (dispatch, getState) => {
  console.log("additionalDetail",additionalDetail)
  const response = await Digit.Complaint.update({
    accountId,
    active,
    auditDetails,
    citizen,
    description,
    id,
    serviceCode,
    serviceRequestId,
    source,
    tenantId,
    address,
    additionalDetail,
    action
  });
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};
