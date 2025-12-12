-- Users table
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       google_id VARCHAR(255) UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       display_name VARCHAR(100),
                       profile_picture_url TEXT,
                       height_cm DECIMAL(5,2),
                       weight_kg DECIMAL(5,2),
                       date_of_birth DATE,
                       gender VARCHAR(20),
                       fitness_level VARCHAR(20) DEFAULT 'BEGINNER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE workouts (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          workout_type VARCHAR(50),
                          scheduled_date DATE,
                          duration_minutes INTEGER,
                          calories_burned INTEGER,
                          status VARCHAR(20) DEFAULT 'PLANNED',
                          notes TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
                           name VARCHAR(100) NOT NULL,
                           exercise_type VARCHAR(50),
                           sets INTEGER,
                           reps INTEGER,
                           weight_kg DECIMAL(6,2),
                           duration_seconds INTEGER,
                           distance_meters DECIMAL(10,2),
                           rest_seconds INTEGER DEFAULT 60,
                           order_index INTEGER DEFAULT 0,
                           notes TEXT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress metrics table
CREATE TABLE progress_metrics (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                  metric_type VARCHAR(50) NOT NULL,
                                  value DECIMAL(10,2) NOT NULL,
                                  unit VARCHAR(20),
                                  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  notes TEXT
);

-- User goals table
CREATE TABLE user_goals (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            goal_type VARCHAR(50) NOT NULL,
                            target_value DECIMAL(10,2),
                            current_value DECIMAL(10,2) DEFAULT 0,
                            unit VARCHAR(20),
                            start_date DATE DEFAULT CURRENT_DATE,
                            target_date DATE,
                            status VARCHAR(20) DEFAULT 'ACTIVE',
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_scheduled_date ON workouts(scheduled_date);
CREATE INDEX idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX idx_progress_user_id ON progress_metrics(user_id);
CREATE INDEX idx_progress_recorded_at ON progress_metrics(recorded_at);
CREATE INDEX idx_goals_user_id ON user_goals(user_id);
