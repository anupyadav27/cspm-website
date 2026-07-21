FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=80
COPY .output ./.output
EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
