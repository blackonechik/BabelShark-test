FROM node:22-bookworm-slim

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

EXPOSE 3000

CMD ["meteor", "run", "--port", "3000", "--allow-superuser"]
