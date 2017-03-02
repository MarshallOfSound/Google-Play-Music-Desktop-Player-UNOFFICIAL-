FROM node:6.3

ENV ELECTRON_ENABLE_STACK_DUMPING true
ENV ELECTRON_ENABLE_LOGGING true

RUN apt-get update && apt-get install -y --no-install-recommends \
  dpkg \
  fakeroot \
  g++ \
  g++-4.8-multilib \
  g++-multilib \
  gcc-4.8-multilib \
  lib32ncurses5 \
  lib32z1 \
  libasound2 \
  libavahi-compat-libdnssd-dev \
  libdbus-1-dev \
  libgconf-2-4 \
  libgtk2.0-0 \
  libgtk2.0-dev \
  libnss3 \
  libx11-dev \
  libxss1 \
  libxtst6 \
  rpm \
  xvfb \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json /app
RUN npm install \
  && npm cache clean \
  && rm -rf /tmp/npm*

ENTRYPOINT ["vendor/docker-entrypoint.sh"]

COPY . /app
