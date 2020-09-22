FROM node:14.4.0-alpine as builder
ADD . /code
WORKDIR /code
RUN npm install
RUN npm run build

FROM nginx:1 as server

COPY --from=builder /code/build /usr/share/nginx/html/
COPY --from=builder /code/build /var/www/html/

COPY static.conf /etc/nginx/conf.d/default.conf
