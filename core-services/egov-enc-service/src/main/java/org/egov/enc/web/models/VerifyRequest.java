package org.egov.enc.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.enc.models.Signature;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotNull;

/**
 * Object with the value and signature to be verified
 */
@ApiModel(description = "Object with the value and signature to be verified")
@Validated
@jakarta.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-10-11T17:31:52.360+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyRequest   {

    @NotNull
    @JsonProperty("value")
    private String value = null;

    @NotNull
    @JsonProperty("signature")
    private Signature signature = null;


}

