# # --- Stage 1: Build with Java 23 ---
#     FROM debian:latest AS builder

#     # Install required dependencies
#     RUN apt update && apt install -y curl unzip maven
    
#     # Download & install Java 23
#     RUN curl -O https://download.java.net/java/early_access/jdk23/35/GPL/openjdk-23-ea+35_linux-x64_bin.tar.gz \
#         && tar -xvf openjdk-23-ea+35_linux-x64_bin.tar.gz \
#         && mv jdk-23 /opt/java23
    
#     # Set Java 23 as default
#     ENV JAVA_HOME=/opt/java23
#     ENV PATH="${JAVA_HOME}/bin:${PATH}"
    
#     # Verify Java version
#     RUN java -version
    
#     # Set working directory
#     WORKDIR /app
    
#     # Copy project files
#     COPY . .
    
#     # Build the project (skip tests for faster build)
#     RUN mvn clean package -DskipTests
    
#     # --- Stage 2: Deploy to Tomcat ---
#     FROM tomcat:11
    
#     # Copy built WAR from previous stage
#     COPY --from=builder /app/target/dms.war /usr/local/tomcat/webapps/
    
#     # Expose the application port
#     EXPOSE 8080
    
#     # Start Tomcat
#     CMD ["catalina.sh", "run"]
    
# Use Maven with Amazon Corretto to build the project
FROM maven:3.8.6-amazoncorretto-23 AS builder
WORKDIR /app

# Copy only the necessary files (excluding unnecessary ones)
COPY pom.xml .
COPY src ./src

# Build the project with Maven
RUN mvn clean package -DskipTests

# Use Tomcat 11 for final deployment
FROM tomcat:11
WORKDIR /usr/local/tomcat/webapps/

# Copy the built WAR file from the builder stage
COPY --from=builder /app/target/dms.war .

# Expose the correct Tomcat port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]

