FROM node:21-bookworm
RUN mkdir /app

# Copying configuaration files
COPY public /app/
COPY src /app/
COPY package.json /app/ 
COPY package-lock.json /app/ 
COPY tsconfig.json /app/ 
COPY pnpm-lock.yaml /app/
COPY tsconfig.node.json /app/
COPY vite.config.ts /app/
COPY .eslintrc.cjs /app/
COPY index.html /app/

WORKDIR /app
RUN npm install
CMD ["npm","run", "dev", "--", "--port", "3000", "--host", "0.0.0.0"]