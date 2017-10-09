#!/usr/bin/env node

import {SkillConfigurationClient} from "../src/SkillConfigurationClient";

const configurationFile = process.argv[2];
console.log("Configuration: " + process.argv[2]);
let url = "https://skillbot.io";
if (process.argv.length > 3) {
    url = process.argv[3];
}

console.log("URL: " + url);
const client = new SkillConfigurationClient(url);

client.uploadFile(configurationFile).then(() => {
    console.log("Done!");
}).catch((e) => {
    console.error(e);
});
