#!/bin/bash

# Install the necessary packages
bun i drizzle-orm better-sqlite3 --force
bun i -D drizzle-kit --force
bun i -D @types/better-sqlite3 --force

# Generate the migrations
npm exec drizzle-kit generate --out migrations --schema db/schema.ts

# Push the migrations
npm exec drizzle-kit push
