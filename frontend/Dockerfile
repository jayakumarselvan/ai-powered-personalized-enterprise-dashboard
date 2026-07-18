FROM registry.redhat.io/ubi9/nodejs-20-minimal:latest

WORKDIR /app

USER root
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve with a minimal static server
RUN npm install -g serve

# Non-root user
RUN useradd -m -u 1001 appuser || true
USER 1001

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
