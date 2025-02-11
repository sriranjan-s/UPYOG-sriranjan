import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const DigiLockerService = {
  authorization: ({ filters }) =>
    Request({
      url: Urls.digiLocker.authorization,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {module:"PT" },
    }),
    register: ({ filters }) =>
    Request({
      url: Urls.digiLocker.register,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {module:"SSO" },
    }),
    token: ( data ) =>
    Request({
      url: Urls.digiLocker.token,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:data,
    }),
    oauth: ( data ) =>
    Request({
      url: Urls.digiLocker.oauth,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      //params:{tenantId:"pg"},
      data:{User:data},
    }),
    issueDoc: ( data ) =>
    Request({
      url: Urls.digiLocker.issueDoc,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:data,
    }),
    uri:( data) =>
    Request({
      url: Urls.digiLocker.uri,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:data
      
    }),
    pdfUrl:(data) =>
    Request({
      url: Urls.eSign.pdfUrl,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:{ pdfUrl:data?.TokenReq?.pdfUrl,redirectUrl:"",fileStoreId:data?.TokenReq?.fileStoreId,module:data?.TokenReq?.module,tenantId:data?.TokenReq?.tenantId,consumerCode:data?.TokenReq?.consumerCode}
    }),
    fileStoreSearch:(data) =>
    Request({
      url: Urls.eSign.fileStoreSearch,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:{module:data?.TokenReq?.module,consumerCode:data?.TokenReq?.consumerCode}
    })
};


