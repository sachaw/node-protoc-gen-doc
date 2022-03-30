import { chmod, createWriteStream } from "fs";
import got from "got";
import { extract } from "tar-stream";
import { createGunzip } from "zlib";
import { executable } from "./index.js";

const protoVersion = "1.5.1";

const releases: {
  platform:
    | "aix"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32";
  arch:
    | "arm"
    | "arm64"
    | "ia32"
    | "mips"
    | "mipsel"
    | "ppc"
    | "ppc64"
    | "s390"
    | "s390x"
    | "x32"
    | "x64";
  url: string;
}[] = [
  {
    platform: "darwin",
    arch: "x64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_darwin_amd64.tar.gz`,
  },
  {
    platform: "darwin",
    arch: "arm64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_darwin_arm64.tar.gz`,
  },
  {
    platform: "linux",
    arch: "x64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_linux_amd64.tar.gz`,
  },
  {
    platform: "linux",
    arch: "arm64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_linux_arm64.tar.gz`,
  },
  {
    platform: "win32",
    arch: "x64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_windows_amd64.tar.gz`,
  },
  {
    platform: "win32",
    arch: "arm64",
    url: `https://github.com/pseudomuto/protoc-gen-doc/releases/download/v${protoVersion}/protoc-gen-doc_${protoVersion}_windows_arm64.tar.gz`,
  },
];

const release = releases.find(
  (release) =>
    release.arch === process.arch && release.platform === process.platform
);

if (release) {
  console.log(executable);

  got
    .stream(release.url)
    .pipe(createGunzip())
    .pipe(extract())
    .on("entry", (entry, stream, next) => {
      if (entry.type === "file" && entry.name.includes("protoc-gen-doc")) {
        stream.pipe(createWriteStream(executable)).on("finish", () => {
          chmod(executable, 755, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      }
      next();
    });
} else {
  throw new Error(
    "Unsupported platform. Was not able to find a proper protoc version."
  );
}
