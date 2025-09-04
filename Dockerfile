FROM dwdraju/alpine-curl-jq

COPY dist /tmp/build
COPY entrypoint.sh entrypoint

ENTRYPOINT ["./entrypoint"]