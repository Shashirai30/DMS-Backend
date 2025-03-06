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


# Use Amazon Corretto 23 as the base image for building
FROM amazoncorretto:23 AS builder
WORKDIR /app

# Install Maven
RUN yum install -y maven

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the project with Java 23 support
RUN mvn clean package -DskipTests

# Use Tomcat 11 as the runtime environment
FROM tomcat:11.0.4
WORKDIR /usr/local/tomcat

# Remove default Tomcat applications
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the built WAR file as ROOT application
COPY --from=builder /app/target/dms.war /usr/local/tomcat/webapps/ROOT.war

# Expose the Tomcat port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
