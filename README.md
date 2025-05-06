# Ambiente de Desenvolvimento Multi-Linguagem

Este repositório contém um ambiente completo de desenvolvimento Docker para múltiplas linguagens de programação com suporte a debug:

- Java (Spring Boot com OpenJDK 25)
- C# (.NET)
- Node.js
- Flutter (versão otimizada para performance)

## Estrutura do Projeto

```
.
├── docker-compose.yml
├── java-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── example/
│                       └── javaservice/
│                           └── JavaServiceApplication.java
├── csharp-service/
│   ├── Dockerfile
│   └── src/
│       ├── CSharpService.csproj
│       └── Program.cs
├── nodejs-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
└── flutter-service/
    ├── Dockerfile
    ├── pubspec.yaml
    └── lib/
        └── main.dart
```

## Configuração das Portas

| Serviço | Porta da Aplicação | Porta de Debug |
|---------|-------------------|---------------|
| Java    | 8080              | 5005          |
| C#      | 5000/5001         | 5002          |
| Node.js | 3000              | 9229          |
| Flutter | 8090              | 8091          |

## Como Utilizar

### 1. Iniciar o ambiente

```bash
docker-compose up -d [service]
```

### 2. Conectar ao Debug

#### Java
- IDE: IntelliJ IDEA ou Eclipse
- Tipo: Remote JVM Debug
- Porta: 5005

#### C#
- IDE: Visual Studio ou VS Code
- Tipo: .NET Core
- Porta: 5002

#### Node.js
- IDE: VS Code
- Tipo: Node.js
- Porta: 9229

#### Flutter
- IDE: Android Studio ou VS Code
- Tipo: Dart & Flutter
- Porta: 8091

### 3. Acessar as aplicações

- Java: http://localhost:8080
- C#: http://localhost:5000
- Node.js: http://localhost:3000
- Flutter: http://localhost:8090

## Volumes e Persistência

Os seguintes volumes são configurados para persistência:
- `maven-repo`: Cache do Maven para o serviço Java
- `node_modules`: Módulos do Node.js
- `flutter-cache`: Cache do Flutter

## Rede

Todos os serviços estão conectados na rede `dev-network` e podem se comunicar entre si usando os nomes dos serviços como hostnames.

## Observações

- Todos os serviços estão configurados com hot-reload para desenvolvimento
- Cada serviço possui um endpoint básico para verificar se está funcionando
- Os códigos fonte dos projetos estão montados como volumes para facilitar o desenvolvimento