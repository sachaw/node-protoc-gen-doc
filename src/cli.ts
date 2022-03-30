#!/usr/bin/env node

import { protoc_gen_doc } from "./index.js";

const [, , ...args] = process.argv;

protoc_gen_doc(
  args,
  {
    encoding: "buffer",
  },
  (err, output) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.stdout.write(output);
  }
);
