FROM node:latest
LABEL authors="dimas"
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["node", "app.js"]
