export interface ISkillBotConfiguration {
    aws?: {
        awsAccessKeyId: string;
        awsSecretAccessKey: string;
        region: string;
    };

    bespoken?: {
        sourceID: string;
        secretKey: string,
    };

    skill: {
        id: string;
        intentSchemaFile?: any;
        interactionModelFile?: any;
        invocationName: string;
        lambdaARN?: string;
        name: string;
        sampleUtterancesFile?: any;
        url?: string;
    };
}
