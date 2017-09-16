import {assert} from "chai";
import {ISkillUploadInfo, SkillConfigurationClient} from "../src/SkillConfigurationClient";

describe("SkillConfiguration Client Test", function() {
    describe("Uploads a skill", function() {
        this.timeout(20000);
        it("Uploads a skill", async () => {
            // This test relies on running against the dev firebase instance
            // It also requires there already be a source "testDoNotDelete"
            const skill: ISkillUploadInfo = {
                id: "testIDToSave",
                intentSchemaFile: "./test/resources/IntentSchema.json",
                invocationName: "test",
                name: "test skill",
                sampleUtterancesFile: "./test/resources/SampleUtterances.txt",
                secretKey: "testSecretKey",
                sourceID: "testDoNotDelete",
                url: "http://skill.com/fake_url",
            };

            const client = new SkillConfigurationClient("http://localhost:3001");
            try {
                await client.uploadSkill(skill);
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Uploads a skill with relative path", async () => {
            // This test relies on running against the dev firebase instance
            // It also requires there already be a source "testDoNotDelete"
            const skill: ISkillUploadInfo = {
                id: "testIDToSave",
                intentSchemaFile: "test/resources/IntentSchema.json",
                invocationName: "test",
                name: "test skill",
                sampleUtterancesFile: "test/resources/SampleUtterances.txt",
                secretKey: "testSecretKey",
                sourceID: "testDoNotDelete",
                url: "http://skill.com/fake_url",
            };

            const client = new SkillConfigurationClient("http://localhost:3001");
            try {
                await client.uploadSkill(skill);
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Uploads a skill without a dashboard source", async () => {
            const skill: ISkillUploadInfo = {
                id: "testIDToSave",
                intentSchemaFile: "./test/resources/IntentSchema.json",
                invocationName: "test",
                name: "test skill",
                sampleUtterancesFile: "./test/resources/SampleUtterances.txt",
                secretKey: "testSecretKey",
                sourceID: "testDoesNotExist",
                url: "http://skill.com/fake_url",
            };

            const client = new SkillConfigurationClient("http://localhost:3001");
            try {
                await client.uploadSkill(skill);
            } catch (e) {
                assert.isTrue(e.message.startsWith("Source does not exist"));
            }
        });
    });
});
