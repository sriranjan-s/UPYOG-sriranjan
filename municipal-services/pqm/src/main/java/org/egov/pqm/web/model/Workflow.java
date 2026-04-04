package org.egov.pqm.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import javax.validation.Valid;

import lombok.*;
import org.egov.tracer.annotations.CustomSafeHtml;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class Workflow {

  @CustomSafeHtml
  @JsonProperty("action")
  private String action = null;

  @JsonProperty("assignes")
  @Valid
  private List<String> assignes = null;

  @CustomSafeHtml
  @JsonProperty("comments")
  private String comments = null;

  @JsonProperty("verificationDocuments")
  @Valid
  private List<Document> verificationDocuments = null;


  @JsonProperty("rating")
  private Integer rating = null;

}
