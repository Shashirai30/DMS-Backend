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



# Java 23 के साथ Tomcat इमेज का उपयोग करें
FROM tomcat:10-jdk-temurin-23

# Tomcat का वेबएप्स फोल्डर साफ करें (डिफॉल्ट पेज हटाने के लिए)
RUN rm -rf /usr/local/tomcat/webapps/*

# आपकी war फाइल को Tomcat के webapps फोल्डर में कॉपी करें
COPY dms.war /usr/local/tomcat/webapps/dms.war

# Tomcat के लिए पोर्ट एक्सपोज करें
EXPOSE 8080

# Tomcat शुरू करें
CMD ["catalina.sh", "run"]
