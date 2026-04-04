package org.egov.pt.service;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DraftsService {
	
	@Autowired
	private PropertyProducer producer;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private PropertyConfiguration propertyConfiguration;
	
	
	@Autowired
	private PropertyUtil propertyUtil;
	
	@Autowired
	private ObjectMapper mapper;

}
