FROM alpine:3.19@sha256:13b7e62e8df80264dbb747995705a986aa530415763a6c58f84a3ca8af9a5bcd
WORKDIR /home

COPY . ./
EXPOSE 7912
RUN apk update && apk add nodejs npm

CMD ["node", "index.js", "0.0.0.0", "7912", "server", "1080"]
