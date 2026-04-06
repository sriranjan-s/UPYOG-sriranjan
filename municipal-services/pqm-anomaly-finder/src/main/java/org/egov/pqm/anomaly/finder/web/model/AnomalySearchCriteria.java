package org.egov.pqm.anomaly.finder.web.model;

import java.util.List;

import org.egov.tracer.annotations.CustomSafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnomalySearchCriteria {

	@JsonProperty("tenantId")
	private String tenantId;
	
	@CustomSafeHtml
	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("ownerIds")
	private List<String> ownerIds;
}
