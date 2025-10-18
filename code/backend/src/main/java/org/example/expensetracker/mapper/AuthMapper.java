package org.example.expensetracker.mapper;

import org.example.expensetracker.dto.AuthRequest;
import org.example.expensetracker.dto.AuthResponse;
import org.example.expensetracker.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AuthMapper {

    User toEntity(AuthRequest authRequest);
    AuthResponse toResponse(User user);
}
