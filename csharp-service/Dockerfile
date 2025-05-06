FROM mcr.microsoft.com/dotnet/sdk:8.0

# Install debugging tools
RUN apt-get update \
    && apt-get install -y \
        procps \
        curl \
        unzip \
    && curl -sSL https://aka.ms/getvsdbgsh | /bin/bash /dev/stdin -v latest -l /vsdbg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything
COPY ./src .

# Restore packages
RUN dotnet restore

EXPOSE 5000 5001 5002

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:5000

# Use shell form to ensure proper process management
CMD dotnet watch run --no-restore --urls "http://0.0.0.0:5000"