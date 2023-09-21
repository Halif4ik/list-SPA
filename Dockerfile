FROM node

WORKDIR .
COPY package.json .
RUN yarn install
COPY . .
CMD ["node", "dist/index.js"]