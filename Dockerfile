FROM alpine:3.19@sha256:13b7e62e8df80264dbb747995705a986aa530415763a6c58f84a3ca8af9a5bcd
WORKDIR /home

ARG port 7912

COPY . ./
EXPOSE port
RUN npm install

CMD ["node index.js --server --tcp --port 7912 --host 0.0.0.0 --private test"]