# Setting Up A Skill
## Install this client
```
npm install skillbot-client -g
```

## Setup your Skill Configuration
Go to the directory for your skill.

Create a skillbot.json file, that will look like this:
```
{
  "aws": { // This section is only needed if you are using a Lambda - for url-based skills, not necessary
    "awsAccessKeyId": "AWS_KEY",
    "awsSecretAccessKey": "AWS_SECRET_KEY",
    "region": "AWS_REGION" // The region where the lambda is located
  },
  "skill": {
    "id": "SkillBotDefault",
    "imageURL": "IMAGE_URL", // This is the image that will be shown with your skill
    "interactionModelFile": "speechAssets/InteractionModel.json", // intentSchemaFile and sampleUtterancesFile can also be used
    "invocationName": "Skillbot Default",
    "lambdaARN": "arn:aws:lambda:us-east-1:048661040156:function:SkillBotDefault-dev-skill", // url can be used instead
    "name": "Skillbot Default Skill"
  }
}
```

The full set of options are captured here:
https://github.com/skillbotio/client/blob/master/src/ISkillBotConfiguration.ts

If the aws object is not provided, the client will check environment variables for these values. It is preferred to store these values in environment variables.

**DO NOT**, by any means, uploaded your AWS credentials to Github or any other public, visible repository.

## Run the skill uploader
```
skillbot skillbot.json
```

If everything works correctly, it should just say done!
The skillbot will automatically update your file with an ID and secretKey for a dashboard source corresponding to your skill.

To do a sanity test, for Lambdas, you can always send a payload to:
```
https://<SKILL_ID>.bespoken.link
```
