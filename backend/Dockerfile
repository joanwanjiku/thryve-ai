# Build stage
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app
# Copy POM first for dependency layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build (skip tests — CI runs them separately)
COPY src src
RUN mvn clean package -DskipTests -B


# Runtime stage
FROM eclipse-temurin:17.0.13_11-jre-jammy

LABEL org.opencontainers.image.description="Thryve AI Fitness Backend"
LABEL org.opencontainers.image.source="https://github.com/joanwanjiku/thryve-ai"

WORKDIR /app

# Create non-root user
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

EXPOSE 8080

# Health check using wget (available in Debian-based images)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
