FROM gpmdp/build-core:latest

RUN sudo apt-get remove --purge libavahi-compat-libdnssd-dev
RUN sudo apt-get autoremove
RUN sudo apt-get update -y && sudo apt-get install libavahi-compat-libdnssd-dev:i386

CMD ["node"]