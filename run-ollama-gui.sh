#!/bin/bash

bun install

# Run `npm run dev` and open the default browser on localhost:3000
bun run dev &
open http://localhost:3000

read -p "Press any key to exit..."
