# Use the official Bun image to run the application
FROM oven/bun:latest AS builder

# Copy the package.json and bun.lock into the container
COPY package.json bun.lock ./

# Install the dependencies
# Install the dependencies
RUN bun install --frozen-lockfile

RUN bash scripts/build.sh

FROM oven/bun:latest AS runner

COPY --from=builder /app/dist .

# Run the application
CMD ["bun", "run", "index.js"]