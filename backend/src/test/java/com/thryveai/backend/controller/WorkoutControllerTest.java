package com.thryveai.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thryveai.backend.dto.ExerciseDTO;
import com.thryveai.backend.dto.WorkoutDTO;
import com.thryveai.backend.entity.ExerciseType;
import com.thryveai.backend.entity.*;
import com.thryveai.backend.entity.WorkoutType;
import com.thryveai.backend.repositories.UserRepository;
import com.thryveai.backend.repositories.WorkoutRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class WorkoutControllerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");

    }

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WorkoutRepository workoutRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        workoutRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
//                .id(UUID.randomUUID())
                .googleId("ggdued212")
                .email("testuser@gmail.com")
                .displayName("testuser")
                .build());
    }

    @Test
    @DisplayName("POST /api/v1/workouts - Should create workout successfully")
    public void createWorkout_ShouldReturnCreated() throws Exception {
        WorkoutDTO.CreateWorkoutRequest request = WorkoutDTO.CreateWorkoutRequest.builder()
                .name("Morning Run")
                .description("Test Workout Description")
                .scheduledDate(LocalDate.now())
                .workoutType(WorkoutType.CARDIO)
                .durationMinutes(60)
                .exercises(List.of(ExerciseDTO.CreateExerciseRequest.builder()
                        .name("Test Exercise")
                        .exerciseType(ExerciseType.CARDIO)
                        .durationSeconds(30)
                        .build(), ExerciseDTO.CreateExerciseRequest.builder()
                        .name("Running")
                        .exerciseType(ExerciseType.CARDIO)
                        .durationSeconds(30)
                        .build()
                ))
                .build();
        mockMvc.perform(
                post("/api/v1/workouts")
                    .header("X-User-Id", testUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.data.name").value("Morning Run"))
                .andExpect(jsonPath("$.data.workoutType").value("CARDIO"))
                .andExpect(jsonPath("$.data.exercises", hasSize(2)))
                .andExpect(jsonPath("$.data.exercises[1].name").value("Running"));

    }

    @Test
    @DisplayName("POST /api/v1/workouts - Should fail with validation error")
    public void createWorkout_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        WorkoutDTO.CreateWorkoutRequest request = WorkoutDTO.CreateWorkoutRequest.builder()
                .name("")
                .build();
        mockMvc.perform(post("/api/v1/workouts")
                    .header("X-User-Id", testUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)
                ))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.name").exists());

    }

    @Test
    @DisplayName("GET /api/v1/workouts - Should return paginated workouts")
    public void getUserWorkouts_ShouldReturnPaginatedWorkouts() throws Exception {
        workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("Workout 1")
                .workoutType(WorkoutType.CROSSFIT)
                .scheduledDate(LocalDate.now())
                .durationMinutes(60)
                .build());
        workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("Workout 2")
                .workoutType(WorkoutType.FLEXIBILITY)
                .scheduledDate(LocalDate.now())
                .durationMinutes(60)
                .build());
        mockMvc.perform(get("/api/v1/workouts")
                .header("X-User-Id", testUser.getId())
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(2)));
    }

    @Test
    @DisplayName("GET /api/v1/workouts/{id} - Should return workout by ID")
    public void getWorkoutById_ShouldReturnWorkout() throws Exception {
        Workout workout = workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("Test Workout")
                .workoutType(WorkoutType.STRENGTH)
                .scheduledDate(LocalDate.now())
                .build());

        mockMvc.perform(get("/api/v1/workouts/{id}", workout.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(workout.getId().toString()))
                .andExpect(jsonPath("$.data.name").value("Test Workout"));
    }

    @Test
    @DisplayName("GET /api/v1/workouts/{id} - Should return 404 for non-existent workout")
    public void getWorkoutById_WithInvalidId_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/v1/workouts/{id}", UUID.randomUUID()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(404));
    }

    @Test
    @DisplayName("PUT /api/v1/workouts/{id} - Should update workout")
    public void updateWorkout_ShouldReturnUpdatedWorkout() throws Exception {
        Workout workout = workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("Orginal Name")
                .workoutType(WorkoutType.CARDIO)
                .build());

        WorkoutDTO.UpdateWorkoutRequest request = WorkoutDTO.UpdateWorkoutRequest.builder()
                .name("Updated Name")
                .status(WorkoutStatus.COMPLETED)
                .caloriesBurned(300)
                .build();

        mockMvc.perform(put("/api/v1/workouts/{id}", workout.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Updated Name"))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.caloriesBurned").value(300));
    }

    @Test
    @DisplayName("DELETE /api/v1/workouts/{id} - Should delete workout")
    public void deleteWorkout_ShouldReturnNoContent() throws Exception {
        Workout workout = workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("To Delete")
                .build());

        mockMvc.perform(delete("/api/v1/workouts/{id}", workout.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/workouts/{id}", workout.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/workouts/{id}/complete - Should mark workout as complete")
    public void completeWorkout_ShouldUpdateStatus() throws Exception {
        Workout workout = workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("To Complete")
                .status(WorkoutStatus.PLANNED)
                .build());

        mockMvc.perform(post("/api/v1/workouts/{id}/complete", workout.getId())
                        .param("caloriesBurned", "250"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.caloriesBurned").value(250));
    }

    @Test
    @DisplayName("GET /api/v1/stats/completed - should return completed workouts")
    public void getCompletedWorkoutsCount_ShouldReturnCount() throws Exception {
        Workout workout = workoutRepository.save(Workout.builder()
                .user(testUser)
                .name("To Complete")
                .status(WorkoutStatus.COMPLETED)
                .build());

        mockMvc.perform(get("/api/v1/workouts/stats/completed")
                    .header("X-User-Id", testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(1));

    }




}
