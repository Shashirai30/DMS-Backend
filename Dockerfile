# # Use Amazon Corretto 23 as the base image for building
# FROM amazoncorretto:23 AS builder
# WORKDIR /app

# # Install Maven
# RUN yum install -y maven

# # Copy project files
# COPY pom.xml .
# COPY src ./src

# # Build the project with Java 23 support
# RUN mvn clean package -DskipTests

# # Use Tomcat 11 as the runtime environment
# FROM tomcat:11.0.4
# WORKDIR /usr/local/tomcat/webapps/

# # Copy the built WAR file
# COPY --from=builder /app/target/dms.war ./dms.war


# # Expose the Tomcat port
# EXPOSE 8080

# # Start Tomcat
# CMD ["catalina.sh", "run"]



# # Stage 1: Build WAR using Maven
# FROM maven:3.9-eclipse-temurin-17 as build

# WORKDIR /app

# # Copy the entire project into the container
# COPY . .

# # Build the WAR file
# RUN mvn clean package -DskipTests

# # Stage 2: Use Tomcat 10 to serve the WAR
# FROM tomcat:10

# # Copy the built WAR from the first stage
# COPY --from=build /app/target/dms.war /usr/local/tomcat/webapps/

# EXPOSE 8080

# CMD ["catalina.sh", "run"]


# Stage 1: Build WAR using Maven
FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Use Tomcat to serve the WAR
FROM tomcat:10

# default empty, can be overridden
ENV JAVA_OPTS=""

COPY --from=build /app/target/dms.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["bash", "-c", "catalina.sh run"]
