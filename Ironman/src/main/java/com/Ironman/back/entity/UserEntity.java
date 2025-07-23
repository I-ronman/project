package com.Ironman.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name ="userinfo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT 와 같은기능
    private Long userid;

    private String email;
    private String pw;
    private String name;
    private String gender;
    private String birthDate;
}
