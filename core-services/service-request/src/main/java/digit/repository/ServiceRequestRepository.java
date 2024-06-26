package digit.repository;

import digit.repository.querybuilder.ServiceDefinitionQueryBuilder;
import digit.repository.querybuilder.ServiceQueryBuilder;
import digit.repository.rowmapper.ServiceDefinitionRowMapper;
import digit.repository.rowmapper.ServiceRowMapper;
import digit.web.models.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class ServiceRequestRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ServiceRowMapper serviceRowMapper;

    @Autowired
    private ServiceQueryBuilder serviceQueryBuilder;

    @Autowired
	private ObjectMapper mapper;

    @Autowired
	private RestTemplate restTemplate;

    public List<Service> getService(ServiceSearchRequest serviceSearchRequest) {
        ServiceCriteria criteria = serviceSearchRequest.getServiceCriteria();

        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(criteria.getIds()) && ObjectUtils.isEmpty(criteria.getTenantId()) && CollectionUtils.isEmpty(criteria.getServiceDefIds()) && CollectionUtils.isEmpty(criteria.getReferenceIds()))
            return new ArrayList<>();

        // Fetch ids based on criteria if ids are not present
        if(CollectionUtils.isEmpty(criteria.getIds())){
            // Fetch ids according to given criteria
            String idQuery = serviceQueryBuilder.getServiceIdsQuery(serviceSearchRequest, preparedStmtList);
            log.info("Service ids query: " + idQuery);
            log.info("Parameters: " + preparedStmtList.toString());
            List<String> serviceIds = jdbcTemplate.query(idQuery, preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));

            if(CollectionUtils.isEmpty(serviceIds))
                return new ArrayList<>();

            // Set ids in criteria
            criteria.setIds(serviceIds);
            preparedStmtList.clear();
        }


        // Search based on the ids found out/ ids been explicitly provided in the request.
        String query = serviceQueryBuilder.getServiceSearchQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), serviceRowMapper);
    }

    /**
	 * fetch method which takes the URI and request object
	 *  and returns response in generic format
	 * @param uri
	 * @param request
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public Map fetchResult(String uri, Object request) {
		
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		Map response = null;
		log.info("URI: "+ uri);
		
		try {
			log.info("Request: "+mapper.writeValueAsString(request));
			response = restTemplate.postForObject(uri, request, Map.class);
		}catch(HttpClientErrorException e) {
			log.error("External Service threw an Exception: ",e.getResponseBodyAsString());
			throw new ServiceCallException(e.getResponseBodyAsString());
		}catch(JsonProcessingException e) {
			log.error("Exception while searching user data : ",e);
		}

		return response;
	}
}
