# Stap 1: Build de applicatie met Maven
FROM maven:3.8.4-openjdk-17 AS build
COPY src/main/java/be/pxl/backend /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Stap 2: Draai de applicatie
FROM openjdk:17-jdk-slim
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]