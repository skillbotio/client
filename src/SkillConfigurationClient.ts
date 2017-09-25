import * as fs from "fs";
import * as path from "path";
import * as request from "request-promise-native";
import {ExternalConfiguration} from "./ExternalConfiguration";
import {ISkillBotConfiguration} from "./ISkillBotConfiguration";

require("dotenv").config();

export class SkillConfigurationClient {
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
        const configurationContents = fs.readFileSync(configurationFile).toString();
        const configurationJSON = JSON.parse(configurationContents);
        await this.uploadJSON(configurationJSON);
        // Write the file back out
        fs.writeFileSync(configurationFile, JSON.stringify(configurationJSON, null, 2));
    }

    public async uploadJSON(configuration: ISkillBotConfiguration): Promise<void> {
        // Load AWS keys from environment - we do not override ones in the configuration
        //  We only set them if they are not there
        if (!configuration.aws) {
            configuration.aws = {} as any;
        }

        const awsConfiguration = configuration.aws as any;
        if (!awsConfiguration.awsAccessKeyId) {
            awsConfiguration.awsAccessKeyId  = process.env.AWS_ACCESS_KEY_ID;
        }

        if (!awsConfiguration.awsSecretAccessKey) {
            awsConfiguration.awsSecretAccessKey  = process.env.AWS_SECRET_ACCESS_KEY;
        }

        if (!awsConfiguration.region) {
            awsConfiguration.region  = process.env.AWS_DEFAULT_REGION;
        }

        const url = this.skillConfigurationURL + "/skill";
        let skillURL = configuration.skill.url;

        if (!configuration.bespoken) {
            const configurator = new ExternalConfiguration();
            await configurator.configure(configuration);
        }

        const bespokenInfo = configuration.bespoken as any;
        // We use our proxy if this is a lambda
        if (configuration.skill.lambdaARN) {
            skillURL = "https://" + bespokenInfo.sourceID + ".bespoken.link";
        }

        const uploadInfo: any = {
            id: configuration.skill.id,
            imageURL: configuration.skill.imageURL,
            invocationName: configuration.skill.invocationName,
            name: configuration.skill.name,
            secretKey: bespokenInfo.secretKey,
            sourceID: bespokenInfo.sourceID,
            url: skillURL,
        };

        if (configuration.skill.intentSchemaFile) {
            const intentSchemaString = SkillConfigurationClient.readFile(configuration.skill.intentSchemaFile);
            const intentSchema = JSON.parse(intentSchemaString);

            const sampleUtterancesString = SkillConfigurationClient.readFile(configuration.skill.sampleUtterancesFile);
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
            uploadInfo.intentSchema = intentSchema;
            uploadInfo.sampleUtterances = sampleUtterances;
        } else if (configuration.skill.interactionModelFile) {
            const interactionModelString = SkillConfigurationClient.readFile(configuration.skill.interactionModelFile);
            uploadInfo.interactionModel = JSON.parse(interactionModelString);
        }

        const postOptions = {
            body: uploadInfo,
            headers: {
                secretKey: uploadInfo.secretKey,
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
    imageURL?: string;
    intentSchema?: any;
    interactionModel?: any;
    invocationName: string;
    name: string;
    sampleUtterances?: any;
    secretKey: string;
    sourceID: string;
    url: string;
}
