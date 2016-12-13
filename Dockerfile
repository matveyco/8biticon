FROM node:argon

RUN apt-get install imagemagick

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN mkdir -p /usr/src/app/public/static/media

EXPOSE 3000

CMD [ "npm", "start" ]
