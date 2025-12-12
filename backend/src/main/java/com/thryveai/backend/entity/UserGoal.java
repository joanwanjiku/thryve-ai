package com.thryveai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "user_goals")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class UserGoal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "goal_type", nullable = false)
    private String goalType;

    @Column(name = "target_value")
    private BigDecimal targetValue;

    @Column(name = "current_value")
    @Builder.Default
    private BigDecimal currentValue = BigDecimal.ZERO;

    private String unit;

    @Column(name = "start_date")
    @Builder.Default
    private LocalDate startDate = LocalDate.now();

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private GoalStatus goalStatus = GoalStatus.ACTIVE;
}
