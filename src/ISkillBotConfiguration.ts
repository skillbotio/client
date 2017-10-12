export interface ISkillBotConfiguration {
    id: string;
    // The image URL that will represent the skill
    imageURL?: string;
    // The intent schema
    intentSchema?: any;
    // The intent schema file for this skill - either this or interactionModelFile must be supplied
    intentSchemaFile?: string;
    // The language model
    interactionModel?: any;
    // The language model file
    interactionModelFile?: string;
    invocationName: string;
    // The lambda ARN to access the skill - AWS information required if this is used
    lambdaARN?: string;
    name: string;
    // The sample utterances file for the skill - must be used with intentSchema
    sampleUtterancesFile?: any;
    // Sample utterances JSON
    sampleUtterances?: any;
    // The URL to access the skill - either this or lambdaARN must be entered
    url?: string;
}
