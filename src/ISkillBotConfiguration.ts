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
        // The ID of the skill, from the skill configuration page
        id: string;
        // The image URL that will represent the skill
        imageURL?: string;
        // The intent schema file for this skill - either this or interactionModelFile must be supplied
        intentSchemaFile?: any;
        // The interaction model file
        interactionModelFile?: any;
        invocationName: string;
        // The lambda ARN to access the skill - AWS information required if this is used
        lambdaARN?: string;
        name: string;
        // The sample utterances file for the skill - must be used with intentSchema
        sampleUtterancesFile?: any;
        // The URL to access the skill - either this or lambdaARN must be entered
        url?: string;
    };
}
