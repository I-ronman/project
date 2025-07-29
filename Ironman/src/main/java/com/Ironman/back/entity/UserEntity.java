package com.Ironman.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name ="user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    private String email;
    private String pw;
    private String name;
    private String gender;
    private String birthdate;
}
