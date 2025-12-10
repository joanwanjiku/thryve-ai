# Build stage
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
#COPY mvnw .
#COPY .mvn .mvn
#RUN chmod +x mvnw
#RUN ./mvnw dependency:go-offline -B
COPY src src
RUN mvn clean package -DskipTests


# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
#RUN addgroup -S spring && adduser -S spring -G spring
#USER spring:spring
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
