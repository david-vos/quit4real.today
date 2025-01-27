FROM node:18 as builder

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /app/dist/ /app/dist

EXPOSE 4173

CMD ["npx", "vite@6.0.7", "preview", "--host"]