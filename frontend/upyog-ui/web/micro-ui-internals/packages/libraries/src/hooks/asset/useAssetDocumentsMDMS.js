import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useAssetDocumentsMDMS = (tenantId, moduleCode, type, config = {}) => {
  
  
  
  const useAssetDocumentsRequiredScreen = () => {
    return useQuery("AST_DOCUMENT_REQ_SCREEN", () => MdmsService.getAssetDocuments(tenantId, moduleCode), config);
  };
  
  

  const _default = () => {
    return useQuery([tenantId, moduleCode, type], () => MdmsService.getMultipleTypes(tenantId, moduleCode, type), config);
  };

  switch (type) {
    
    case "Documents":
      return useAssetDocumentsRequiredScreen();
    
    default:
      return _default();
  }
};

export default useAssetDocumentsMDMS;
