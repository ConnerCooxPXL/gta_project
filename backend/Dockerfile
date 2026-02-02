# Stap 1: Build de applicatie met de nieuwste Maven en Java 21+ ondersteuning
FROM maven:3-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stap 2: Draai de applicatie op Java 21 (meest stabiele moderne versie)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]