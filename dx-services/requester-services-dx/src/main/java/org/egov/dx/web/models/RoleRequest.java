package org.egov.dx.web.models;

import lombok.AllArgsConstructor;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.egov.dx.web.models.Role;

@Getter
@Builder
@AllArgsConstructor
@EqualsAndHashCode(of = {"code", "tenantId"})
public class RoleRequest {

    private String code;
    private String name;
    private String tenantId;

    public RoleRequest(Role domainRole) {
        this.code = domainRole.getCode();
        this.name = domainRole.getName();
        this.tenantId = domainRole.getTenantId();
    }

    public Role toDomain() {
        return Role.builder()
                .code(code)
                .name(name)
                .tenantId(tenantId)
                .build();
    }
}
