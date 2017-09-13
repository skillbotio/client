import {ISkillUploadInfo, SkillConfigurationClient} from "../src/SkillConfigurationClient";

const client = new SkillConfigurationClient("http://localhost:3001");

const info: ISkillUploadInfo = {
    id: "Giftionary",
    intentSchemaFile: "/Users/jpk/atom/PictoGiphy/speechAssets/IntentSchema.json",
    invocationName: "Giftionary",
    name: "Giftionary",
    sampleUtterancesFile: "/Users/jpk/atom/PictoGiphy/speechAssets/SampleUtterances.txt",
    secretKey: "aaaa34ce-3d55-40de-bfcd-2c7f9834f4c7",
    sourceID: "determined-rice",
    url: "https://modest-lewis.bespoken.link",
};
client.uploadSkill(info).then(() => {
    console.log("Done!");
}).catch((e) => {
    console.error(e);
});
