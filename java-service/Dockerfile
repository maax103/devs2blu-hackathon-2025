FROM openjdk:17-jdk-slim

WORKDIR /app

# Install debugging tools
RUN apt-get update && apt-get install -y \
    maven \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project configuration files
COPY pom.xml ./
COPY src ./src

# Pre-download dependencies
RUN mvn dependency:go-offline -B

# Default command without duplicate debug config
CMD ["mvn", "spring-boot:run"]