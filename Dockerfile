FROM node:9.11.1-alpine as build
ARG PT_DIR_PATH
WORKDIR ${PT_DIR_PATH}
RUN apk add --no-cache --virtual .deps g++ make bash libpng-dev git autoconf automake build-base libtool nasm
RUN git clone -b v3.3.1 --single-branch git://github.com/mozilla/mozjpeg.git \
  && cd mozjpeg \
  && autoreconf -fiv \
  && ./configure --prefix=/opt/mozjpeg \
  && make install \
  && cd .. \
  && rm -r mozjpeg
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean
COPY .env.production.local webpack.config.js ./
COPY src/ src/
RUN yarn build-prod && apk del .deps

FROM nginx:1.13.12-alpine as server
ARG PT_DIR_PATH
ARG PT_SERVER_NAME
ENV PT_DIR_PATH ${PT_DIR_PATH}
ENV PT_SERVER_NAME ${PT_SERVER_NAME}
WORKDIR /etc/nginx
EXPOSE 80
COPY nginx-config/ ./
COPY --from=build ${PT_DIR_PATH}/build ${PT_DIR_PATH}
CMD envsubst \$PT_SERVER_NAME,\$PT_DIR_PATH < sites-available/server.conf > sites-enabled/server.conf \
  && nginx -g "daemon off;"
# CMD tail -f /dev/null
