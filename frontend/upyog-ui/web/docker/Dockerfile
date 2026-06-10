FROM upyogio/alpine-node-builder-14:yarn AS build
#FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0

RUN yarn config set ignore-engines true

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=20480"
ENV GENERATE_SOURCEMAP "false"

COPY ${WORK_DIR} .
RUN ls -lah

RUN yarn config set ignore-engines true

#RUN node web/envs.js
RUN cd web/ \
    && node envs.js \
    && node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(20480*20480))' \
    && ./install-deps.sh \
    && yarn install --force \
    && echo "=== Checking PT Module ===" \
    && yarn why @upyog/digit-ui-module-pt || true \
    && ls -la node_modules/@upyog || true \
    && yarn build

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/upyog-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
