FROM node:22-bookworm-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    bash \
    build-essential \
    ca-certificates \
    curl \
    git \
    python3 \
  && rm -rf /var/lib/apt/lists/*

RUN curl https://install.meteor.com/?release=3.4 | sh

ENV PATH="/root/.meteor:${PATH}"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN meteor build --directory /opt/build --server-only --allow-superuser
RUN cd /opt/build/bundle/programs/server && npm install --production

FROM node:22-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /opt/build/bundle /app/bundle
COPY settings.docker.json /app/settings.docker.json

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-lc", "export METEOR_SETTINGS=\"$(cat /app/settings.docker.json)\" && exec node /app/bundle/main.js"]
