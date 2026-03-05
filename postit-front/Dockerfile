# Build stage
FROM node:22-alpine AS builder

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}
ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}
ENV no_proxy=${no_proxy}
ENV NPM_CONFIG_STRICT_SSL=false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm install -g next react react-dom

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:22-alpine

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}
ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}
ENV no_proxy=${no_proxy}
ENV NPM_CONFIG_STRICT_SSL=false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache --no-check-certificate dumb-init

# Install Next.js CLI globally
RUN npm -g install next react react-dom

# Copy package files
COPY --from=builder /app/package*.json ./

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built application and config from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the port
EXPOSE 3000

# Use dumb-init to run the app
ENTRYPOINT ["dumb-init", "--"]

# Run the application
CMD ["next", "start"]
