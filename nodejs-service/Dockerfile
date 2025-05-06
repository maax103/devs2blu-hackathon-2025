FROM node:23-slim

WORKDIR /app

# Instalar ferramentas para debug
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de configuração do projeto
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Expor portas para a aplicação e debug
EXPOSE 3000 9229

# Comando padrão com suporte a debug
CMD ["npm", "run", "dev"]