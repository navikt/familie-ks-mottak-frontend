FROM navikt/node-express:1.0.0
RUN apk --no-cache add curl

ADD ./ /var/server/

CMD ["yarn", "start"]