# Build Stage: Install dependencies, set environment, and build the React app
# Production Stage: Copy built files to Nginx and serve the app

FROM upyogio/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=2560"
ENV GENERATE_SOURCEMAP "true"

COPY ${WORK_DIR} .
RUN ls -lah

RUN yarn config set ignore-engines true
#RUN node web/envs.js
RUN cd web/ \
    && node envs.js \
    && node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(2560*2560))' \
    &&  ./install-deps.sh \
    && yarn install \
    && yarn build 
    

FROM nginx:mainline-alpine
ENV WORK_DIR=/var/web/sv-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
