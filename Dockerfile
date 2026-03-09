# Dockerfile

# Imagem base com Node LTS
FROM node:20-alpine

# Instala dependências do sistema necessárias para o Expo
RUN apk add --no-cache bash curl

# Instala o Expo CLI globalmente
RUN npm install -g expo-cli@latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
# (otimização de cache do Docker — só reinstala se mudar o package.json)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código
COPY . .

# Expõe as portas que o Expo usa
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Comando que roda ao iniciar o container
CMD ["npx", "expo", "start", "--tunnel"]