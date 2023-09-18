FROM node
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . .
ENV PORT 3001
EXPOSE $PORT
CMD ["node", "dist/index.js"]
