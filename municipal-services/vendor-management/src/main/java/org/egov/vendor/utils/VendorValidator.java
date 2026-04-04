package org.egov.vendor.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.web.models.VendorAdditionalDetailsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class VendorValidator {

    @Autowired
    private MDMSValidator mdmsValidator;

    @Autowired
    VendorConfiguration config;

    public void validateCreate(VendorAdditionalDetailsRequest vendorRequest, Object mdmsData) {
        mdmsValidator.validateMdmsData(vendorRequest, mdmsData);
        // validateApplicationDocuments();
    }

    /**
     * Validates if the search parameters are valid
     *
     * @param requestInfo The requestInfo of the incoming request
     * @param criteria    The BPASearch Criteria
     */

    /**
     * Validates if the paramters coming in search are allowed
     *
     * @param criteria      BPA search criteria
     * @param allowedParams Allowed Params for search
     */


}
