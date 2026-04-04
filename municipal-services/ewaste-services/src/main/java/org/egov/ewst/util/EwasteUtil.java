package org.egov.ewst.util;

import org.egov.ewst.config.EwasteConfiguration;
import org.egov.ewst.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class EwasteUtil extends CommonUtils {

	@Autowired
	private EwasteConfiguration configs;

	@Autowired
	private ServiceRequestRepository restRepo;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Utility method to fetch bill for validation of payment
	 *
	 * @param propertyId
	 * @param tenantId
	 * @param request    //
	 */


}
