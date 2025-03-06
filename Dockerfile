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

# Remove default Tomcat applications
RUN rm -rf /usr/local/tomcat/webapps/*

# Extract the WAR file directly to ROOT directory
COPY --from=builder /app/target/dms.war /tmp/
RUN mkdir -p /usr/local/tomcat/webapps/ROOT && \
    unzip /tmp/dms.war -d /usr/local/tomcat/webapps/ROOT && \
    rm /tmp/dms.war

# Expose the Tomcat port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
