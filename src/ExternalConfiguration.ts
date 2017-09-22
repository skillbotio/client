import * as request from "request-promise-native";
import * as UUID from "uuid";
import {ISkillBotConfiguration} from "./ISkillBotConfiguration";

export class ExternalConfiguration {
    // Configures a skill with the Bespoken Spoke and Source if it does not already exist
    public async configure(skillBotConfiguration: ISkillBotConfiguration) {
        await this.createSource(skillBotConfiguration);
        // Create a pipe if this is a lambda
        if (skillBotConfiguration.skill.lambdaARN) {
            await this.createPipe(skillBotConfiguration);
        }
    }

    private async createSource(skillBotConfiguration: ISkillBotConfiguration): Promise<any> {
        const uuid = UUID.v4();
        const sourceBody: any = {
            source: {
                id: skillBotConfiguration.skill.id.toLowerCase(),
                liveDebug: false,
                name: skillBotConfiguration.skill.name,
                secretKey: uuid,
            },
        };

        skillBotConfiguration.bespoken = {
            secretKey: uuid,
            sourceID: skillBotConfiguration.skill.id.toLowerCase(),
        };

        const options = {
            body: sourceBody,
            headers: {},
            json: true,
            timeout: 30000,
            uri: "https://source-api.bespoken.tools/v1/createSource",
        };

        return request.post(options).catch((error) => {
            console.log(error);
            return Promise.reject(error);
        });
    }

    private async createPipe(skillBotConfiguration: ISkillBotConfiguration): Promise<any> {
        const bespokenInfo = skillBotConfiguration.bespoken as any;
        const options: any = {
            body: {
                // The secret key for the Skill
                diagnosticsKey: null,
                endPoint: {
                    // The unique name/ID for the skill
                    name: bespokenInfo.sourceID,
                },
                path: "/",
                proxy: false,
                uuid: bespokenInfo.secretKey,
            },
            headers: {
                "x-access-token": "4772616365-46696f72656c6c61",
            },
            json: true, // Automatically parses the JSON string in the response
            timeout: 30000,
            uri: "https://api.bespoken.link/pipe",
        };

        if (skillBotConfiguration.skill.url) {
            options.body.http = {
                url: skillBotConfiguration.skill.url,
            };
            options.body.pipeType = "HTTP";
        } else {
            const awsInfo = skillBotConfiguration.aws as any;
            options.body.lambda = {
                awsAccessKeyId: awsInfo.awsAccessKeyId,
                awsSecretAccessKey: awsInfo.awsSecretAccessKey,
                lambdaARN: skillBotConfiguration.skill.lambdaARN,
                region: awsInfo.region,
            };
            options.body.pipeType = "LAMBDA";
        }

        return await request.post(options);
    }
}