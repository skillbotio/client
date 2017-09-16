import * as fs from "fs";
import {ISkillUploadInfo, SkillConfigurationClient} from "../src/SkillConfigurationClient";

const configurationFile = process.argv[2];
console.log("Configuration: " + process.argv[2]);
let url = "http://skillbot.bespoken.io";
if (process.argv.length > 3) {
    url = process.argv[3];
}

console.log("URL: " + url);
const client = new SkillConfigurationClient(url);

const configurationContents = fs.readFileSync(configurationFile).toString();
const configurationJSON = JSON.parse(configurationContents);

client.uploadSkill(configurationJSON as ISkillUploadInfo).then(() => {
    console.log("Done!");
}).catch((e) => {
    console.error(e);
});
