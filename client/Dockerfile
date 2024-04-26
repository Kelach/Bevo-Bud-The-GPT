FROM node:21-bookworm
RUN mkdir /app

# Copying configuaration files
COPY public /app/
COPY src /app/
COPY *.json /app/ 
COPY *.yaml /app/
COPY *.ts /app/
COPY *.cjs /app/
COPY *.html /app/

WORKDIR /app
RUN npm install
CMD ["npm","run", "dev", "--", "--port", "3000", "&"]