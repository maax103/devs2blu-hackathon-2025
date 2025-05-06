FROM debian:bookworm-slim

# Evitar interações durante a instalação
ENV DEBIAN_FRONTEND=noninteractive

# Configurar variáveis de ambiente para Flutter
ENV FLUTTER_HOME=/flutter
ENV PATH=$FLUTTER_HOME/bin:$PATH

# Instalar dependências essenciais
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    unzip \
    xz-utils \
    libglu1-mesa \
    libstdc++6 \
    fontconfig \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen

# Configurar Git
RUN git config --global --add safe.directory /flutter

# Baixar e configurar Flutter
RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME --depth 1 -b stable \
    && flutter precache --web \
    && flutter config --no-analytics \
    && flutter pub cache repair \
    && flutter doctor -v \
    && flutter config --enable-web

WORKDIR /app

# Expor portas
EXPOSE 8090 8091

# Iniciar o servidor web Flutter
CMD ["sh", "-c", "flutter pub get && flutter run -d web-server --web-hostname=0.0.0.0 --web-port=8090"]