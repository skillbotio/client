import * as fs from "fs";
import * as path from "path";
import * as request from "request-promise-native";
import {ISkillBotConfiguration} from "./ISkillBotConfiguration";

require("dotenv").config();

export class SkillConfigurationClient {
    private static awsInfo(): any {
        const config = {} as any;
        config.accessKeyId  = process.env.AWS_ACCESS_KEY_ID;
        config.secretAccessKey  = process.env.AWS_SECRET_ACCESS_KEY;
        config.region  = process.env.AWS_DEFAULT_REGION;
        return config;
    }

    private static cleanFilePath(filePathString: string) {
        let filePath = filePathString;
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(process.cwd(), filePathString);
        }
        return filePath;
    }

    private static readFile(filePath: string): string {
        filePath = SkillConfigurationClient.cleanFilePath(filePath);
        return fs.readFileSync(filePath, "utf-8");
    }

    public constructor(public skillConfigurationURL: string) {}

    public async uploadFile(configurationFile: string): Promise<void> {
        if (configurationFile === "skill.json") {
            if (!fs.existsSync(".ask/config")) {
                throw new Error("Cannot find file .ask/config - this is required to get the skill ID");
            }

            const askConfig = JSON.parse(fs.readFileSync(".ask/config", "UTF-8"));
            const skillConfig = JSON.parse(fs.readFileSync("skill.json", "UTF-8"));
            const modelConfig = JSON.parse(fs.readFileSync("models/en-US.json", "UTF-8"));
            return this.uploadSkillManagementJSON(skillConfig, modelConfig, askConfig);
        } else if (configurationFile === "skillbot.json") {
            const configurationContents = fs.readFileSync(configurationFile).toString();
            const configurationJSON = JSON.parse(configurationContents);
            return this.uploadClassicJSON(configurationJSON);
            // Write the file back out
        }
    }

    public async uploadSkillManagementJSON(skillJSON: any, modelJSON: any, askConfig: any) {
        const skillID = askConfig.deploy_settings.default.skill_id;
        if (!skillID || skillID.trim() === "") {
            throw new Error("Skill ID is not set in the .ask/config file properly. Please fix.");
        }
        const publishingInfo = skillJSON.skillManifest.publishingInformation.locales["en-US"];
        const skillName = publishingInfo.name;
        const invocationName = modelJSON.interactionModel.languageModel.invocationName;
        const imageURL = publishingInfo.largeIconUri;
        const uri = skillJSON.skillManifest.apis.custom.endpoint.uri;

        const awsConfig = SkillConfigurationClient.awsInfo();

        const skillbotConfig: any = {
            aws: awsConfig,
            id: skillID,
            imageURL,
            interactionModel: modelJSON,
            invocationName,
            name: skillName,
        };

        if (uri.startsWith("https")) {
            skillbotConfig.url = uri;
        } else {
            skillbotConfig.lambdaARN = uri;
        }

        return await this.upload(skillbotConfig);
    }

    public async uploadClassicJSON(configuration: ISkillBotConfiguration): Promise<void> {
        // Load AWS keys from environment
        (configuration as any).aws = SkillConfigurationClient.awsInfo();

        if (configuration.intentSchemaFile) {
            const intentSchemaString = SkillConfigurationClient.readFile(configuration.intentSchemaFile);
            const intentSchema = JSON.parse(intentSchemaString);

            const sampleUtterancesString = SkillConfigurationClient.readFile(configuration.sampleUtterancesFile);
            const lines = sampleUtterancesString.split("\n");
            const sampleUtterances: {[id: string]: string[]} = {};

            for (const line of lines) {
                if (line.trim().length === 0) {
                    continue;
                }

                const intent = line.split(" ", 2)[0];
                const utterance = line.split(" ").slice(1).join(" ");
                let utterances: string[];
                if (intent in sampleUtterances) {
                    utterances = sampleUtterances[intent];
                } else {
                    utterances = [];
                    sampleUtterances[intent] = utterances;
                }
                utterances.push(utterance);
            }
            configuration.intentSchema = intentSchema;
            configuration.sampleUtterances = sampleUtterances;
        } else if (configuration.interactionModelFile) {
            const interactionModelString = SkillConfigurationClient.readFile(configuration.interactionModelFile);
            configuration.interactionModel = JSON.parse(interactionModelString);
        }

        return await this.upload(configuration);
    }

    private async upload(uploadInfo: ISkillBotConfiguration): Promise<any> {
        const url = this.skillConfigurationURL + "/skill";

        const postOptions = {
            body: uploadInfo,
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
