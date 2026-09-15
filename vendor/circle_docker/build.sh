#!/bin/bash
name=$1

docker build $name -t gpmdp/build-$name
docker push gpmdp/build-$name