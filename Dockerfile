FROM node:22-alpine
WORKDIR /app
COPY . .
ENV HOST=0.0.0.0 PORT=8080
EXPOSE 8080
RUN mkdir -p /app/.runtime && chown node:node /app/.runtime
USER node
CMD ["node", "server.cjs"]
