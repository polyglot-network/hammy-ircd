import fs from "fs";

let config = {
    port: 6667,
    version: JSON.parse(fs.readFileSync("./package.json")).version,
    hostname: "irdc.hammy.network",
    startTime: new Date().toUTCString()
}

export {config};