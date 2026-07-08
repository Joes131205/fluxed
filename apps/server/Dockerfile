FROM oven/bun

COPY package.json bun.lock* turbo.json ./

COPY apps/packages/db/package.json ./packages/db
COPY apps/packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./server/

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "turbo", "run", "dev", "--filter=@app/server"]