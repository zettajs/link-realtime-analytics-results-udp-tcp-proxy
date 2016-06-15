#!/bin/sh

docker rm link-analytics-udp-tcp-proxy.service
docker rmi zetta/link-analytics-udp-tcp-proxy

docker build -t zetta/link-analytics-udp-tcp-proxy .

