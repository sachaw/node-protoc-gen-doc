import {
  execFile,
  ExecFileException,
  ExecFileOptionsWithBufferEncoding,
} from "child_process";
import { dirname, join, resolve } from "path";

export const executable = join(
  resolve(dirname("")),
  "dist",
  `protoc-gen-doc${process.platform === "win32" ? ".exe" : ""}`
);

export const protoc_gen_doc = (
  args: ReadonlyArray<string> | undefined | null,
  options: ExecFileOptionsWithBufferEncoding,
  callback: (
    error: ExecFileException | null,
    stdout: Buffer,
    stderr: Buffer
  ) => void
): void => {
  execFile(executable, args, options, callback);
};
