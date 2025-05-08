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



# Java 23 का उपयोग करके बेस इमेज
FROM eclipse-temurin:23-jdk

# Tomcat डाउनलोड और इंस्टॉल करें
ENV TOMCAT_VERSION=10.1.19
ENV CATALINA_HOME=/usr/local/tomcat

RUN mkdir -p $CATALINA_HOME

# Tomcat डाउनलोड और एक्सट्रैक्ट करें
RUN curl -O https://dlcdn.apache.org/tomcat/tomcat-10/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz \
    && tar -xf apache-tomcat-${TOMCAT_VERSION}.tar.gz -C /tmp \
    && cp -R /tmp/apache-tomcat-${TOMCAT_VERSION}/* $CATALINA_HOME \
    && rm -rf /tmp/apache-tomcat-${TOMCAT_VERSION} \
    && rm apache-tomcat-${TOMCAT_VERSION}.tar.gz

# डिफॉल्ट वेबएप्स हटाएं
RUN rm -rf $CATALINA_HOME/webapps/*

# आपकी WAR फाइल कॉपी करें
COPY target/dms.war $CATALINA_HOME/webapps/dms.war

# पोर्ट एक्सपोज करें
EXPOSE 8080

# Tomcat शुरू करें
CMD ["sh", "-c", "$CATALINA_HOME/bin/catalina.sh run"]
