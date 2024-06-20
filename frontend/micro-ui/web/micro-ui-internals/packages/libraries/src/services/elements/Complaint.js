export const Complaint = {
  create: async ({
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
    additionalDetail,
    emailId,
    name,
    action
  }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const defaultData = {
      service: {
        tenantId: "pg.citya",
        serviceCode: complaintType,
        description: description,
        additionalDetail: additionalDetail,
        source: Digit.Utils.browser.isWebview() ? "mobile" : "web",
        address: {
          landmark: landmark,
          city: city,
          district: district,
          region: region,
          state: state,
          pincode: pincode,
          locality: {
            code: localityCode,
            name: localityName,
          },
          geoLocation: {},
        },
      },
      workflow: {
        action: action
      },
    };

    if (Digit.SessionStorage.get("user_type") === "employee") {
      defaultData.service.citizen = {
        name: name,
        type: "CITIZEN",
        mobileNumber: mobileNumber,
        emailId:emailId,
        roles: [
          {
            id: null,
            name: "Citizen",
            code: "CITIZEN",
            tenantId: tenantId,
          },
        ],
        tenantId: tenantId,
      };
    }
    const response = await Digit.PGRService.create(defaultData, cityCode);
    return response;
  },
  update: async ({
    accountId,
    active,
    auditDetails,
    citizen,
    description,
    id,
    serviceCode,
    serviceRequestId,
    source,
    address,
      additionalDetail,
      action

  }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const defaultDataNew = {
      service: {
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
        additionalDetail
      },
      workflow: {
        action: action
      },
    };
console.log("dddddddddddd",defaultDataNew)
    const response = await Digit.PGRService.update(defaultDataNew, "pg.citya");
    return response;
  },
  assign: async (complaintDetails, action, employeeData, comments, uploadedDocument, tenantId) => {
    complaintDetails.workflow.action = action;
    complaintDetails.workflow.assignes = employeeData ? [employeeData.uuid] : null;
    complaintDetails.workflow.comments = comments;
    uploadedDocument
      ? (complaintDetails.workflow.verificationDocuments = [
            {
              documentType: "PHOTO",
              fileStoreId: uploadedDocument,
              documentUid: "",
              additionalDetails: {},
            },
          ])
      : null;

    if (!uploadedDocument) complaintDetails.workflow.verificationDocuments = [];
    
    //TODO: get tenant id
    const response = await Digit.PGRService.update(complaintDetails, tenantId);
    return response;
  },
};
