FROM node:6.3

RUN apt-get update
RUN apt-get install g++-multilib lib32z1 lib32ncurses5 -y
RUN apt-get install rpm fakeroot dpkg libdbus-1-dev libx11-dev -y
RUN apt-get install libavahi-compat-libdnssd-dev g++ -y
RUN apt-get install gcc-4.8-multilib g++-4.8-multilib -y
RUN apt-get install libgtk2.0-0 libgtk2.0-dev xvfb -y
RUN apt-get install libxtst6 -y

WORKDIR /app

COPY package.json /app
RUN npm install

RUN apt-get install libxss1 libnss3 libasound2 libgconf-2-4 -y

RUN export ELECTRON_ENABLE_STACK_DUMPING=true
RUN export ELECTRON_ENABLE_LOGGING=true

ADD vendor/docker-entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]

COPY . /app
