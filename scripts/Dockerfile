FROM mhart/alpine-node:latest
COPY ./ /build
COPY ./scripts/nginx.conf /etc/nginx/
RUN apk --update add git yarn nginx && \
    cd /build && \
    yarn && \
    yarn build && \
    mv ./build /www && \
    mkdir -p /run/nginx
EXPOSE 80
CMD exec nginx -g "daemon off;"
