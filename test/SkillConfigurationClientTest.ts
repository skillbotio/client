import {assert} from "chai";
import * as uuid from "uuid";
import {ISkillBotConfiguration} from "../src/ISkillBotConfiguration";
import {SkillConfigurationClient} from "../src/SkillConfigurationClient";

const SKILLBOT_URL = "https://skillbot.bespoken.io";

describe("SkillConfiguration Client Test", function() {
    describe("Uploads a skill", function() {
        this.timeout(20000);
        it("Uploads a skill", async () => {
            const skill: ISkillBotConfiguration = {
                bespoken: {
                    secretKey: "testSecretKey",
                    sourceID: "testDoNotDelete",
                },
                skill: {
                    id: "testIDToSave",
                    intentSchemaFile: "./test/resources/IntentSchema.json",
                    invocationName: "test",
                    name: "test skill",
                    sampleUtterancesFile: "./test/resources/SampleUtterances.txt",
                    url: "http://skill.com/fake_url",
                },
            };

            const client = new SkillConfigurationClient(SKILLBOT_URL);
            try {
                await client.uploadJSON(skill);
            } catch (e) {
                console.log(e);
                assert.fail(e, e.message);
            }
        });

        it("Uploads a skill with relative path", async () => {
            // This test relies on running against the dev firebase instance
            // It also requires there already be a source "testDoNotDelete"
            const skill: ISkillBotConfiguration = {
                bespoken: {
                    secretKey: "testSecretKey",
                    sourceID: "testDoNotDelete",
                },
                skill: {
                    id: "testIDToSave",
                    intentSchemaFile: "test/resources/IntentSchema.json",
                    invocationName: "test",
                    name: "test skill",
                    sampleUtterancesFile: "test/resources/SampleUtterances.txt",
                    url: "http://skill.com/fake_url",
                },
            };

            const client = new SkillConfigurationClient(SKILLBOT_URL);
            try {
                await client.uploadJSON(skill);
            } catch (e) {
                assert.fail(e);
            }
        });

        it("Uploads a skill with a dashboard source that does not exist", async () => {
            const skill: ISkillBotConfiguration = {
                bespoken: {
                    secretKey: "testSecretKey",
                    sourceID: "testDoesNotExist",
                },
                skill: {
                    id: "testDoesNotExist",
                    intentSchemaFile: "test/resources/IntentSchema.json",
                    invocationName: "test",
                    name: "test skill",
                    sampleUtterancesFile: "test/resources/SampleUtterances.txt",
                    url: "http://skill.com/fake_url",
                },
            };

            const client = new SkillConfigurationClient(SKILLBOT_URL);
            try {
                await client.uploadJSON(skill);
            } catch (e) {
                assert.isTrue(e.message.startsWith("Source does not exist"));
            }
        });

        it("Does not have a dashboard source specified", async () => {
            const id = "testSkillBotSkill" + uuid.v4();
            const skill: ISkillBotConfiguration = {
                skill: {
                    id,
                    intentSchemaFile: "test/resources/IntentSchema.json",
                    invocationName: "test",
                    name: "test skill",
                    sampleUtterancesFile: "test/resources/SampleUtterances.txt",
                    url: "http://skill.com/fake_url",
                },
            };

            const client = new SkillConfigurationClient(SKILLBOT_URL);
            try {
                await client.uploadJSON(skill);
            } catch (e) {
                assert.isTrue(e.message.startsWith("Source does not exist"));
            }
        });
    });
});
