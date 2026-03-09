FROM node:20-alpine

RUN apk add --no-cache bash curl

RUN npm install -g expo-cli@latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

ENV CI=1
ENV EXPO_NO_TELEMETRY=1

CMD ["npx", "expo", "start", "--lan", "--port", "8081"]