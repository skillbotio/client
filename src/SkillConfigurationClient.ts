import * as fs from "fs";
import * as request from "request-promise-native";

export class SkillConfigurationClient {
    public constructor(public skillConfigurationURL: string) {}

    public async uploadSkill(skill: ISkillUploadInfo): Promise<void> {
        const url = this.skillConfigurationURL + "/skill";
        if (skill.intentSchemaFile) {
            const intentSchemaString = fs.readFileSync(skill.intentSchemaFile, "utf-8");
            const intentSchema = JSON.parse(intentSchemaString);

            const sampleUtterancesString = fs.readFileSync(skill.sampleUtterancesFile, "utf-8").toString();
            const lines = sampleUtterancesString.split("\n");
            const sampleUtterances: {[id: string]: string[]} = {};

            for (const line of lines) {
                if (line.trim().length === 0) {
                    continue;
                }

                const intent = line.split(" ", 2)[0];
                const utterance = line.split(" ", 2)[1];
                let utterances: string[];
                if (intent in sampleUtterances) {
                    utterances = sampleUtterances[intent];
                } else {
                    utterances = [];
                    sampleUtterances[intent] = utterances;
                }
                utterances.push(utterance);
            }
            skill.intentSchema = intentSchema;
            skill.sampleUtterances = sampleUtterances;
        } else if (skill.interactionModelFile) {
            const interactionModelString = fs.readFileSync(skill.interactionModelFile, "utf-8");
            skill.interactionModel = JSON.parse(interactionModelString);
        }

        const postOptions = {
            body: skill,
            headers: {
                secretKey: skill.secretKey,
            },
            json: true,
            method: "POST",
            uri: url,
        };

        try {
            return await request(postOptions);
        } catch (e) {
            if (e.response && e.response.statusCode === 404) {
                throw new Error("Source does not exist in dashboard. Please create it.");
            } else {
                throw e;
            }
        }
    }
}

export interface ISkillUploadInfo {
    id: string;
    intentSchema?: any;
    intentSchemaFile?: any;
    interactionModel?: any;
    interactionModelFile?: any;
    invocationName: string;
    name: string;
    sampleUtterances?: any;
    sampleUtterancesFile?: any;
    secretKey: string;
    sourceID: string;
    url: string;
}
