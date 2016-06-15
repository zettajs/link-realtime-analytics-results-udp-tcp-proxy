#!/bin/sh

source /etc/environment

docker run --rm --name link-analytics-udp-tcp-proxy.service -p 3007:3007/udp -e COREOS_PRIVATE_IPV4=${COREOS_PRIVATE_IPV4} zetta/link-analytics-udp-tcp-proxy
