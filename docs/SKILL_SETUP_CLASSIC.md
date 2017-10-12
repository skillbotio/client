# Setting Up A Skill
## Pre-requisites
These instructions assume a skill setup in the "classic" style.

Though not an official standard, it expects the following structure:
* speechAssets directory with IntentShema.json and SampleUtterances.txt
* OR a single interactionModel.json under speechAssets

The filenames are configurable, but the key thing is that the speechAssets be stored locally, copied from the console.

Take a look here to see how Amazon does it:  
[https://github.com/alexa/skill-sample-nodejs-hello-world/tree/master/speechAssets](https://github.com/alexa/skill-sample-nodejs-hello-world/tree/master/speechAssets)

## Install this client
```
npm install skillbot-client -g
```

## Setup your Skill Configuration
Go to the directory for your skill.

Create a skillbot.json file, that will look like this:
```
{
  "id": "amzn1.ask.skill.some_random_hexadecimal_characters", // Get this in the Alexa skill console
  "imageURL": "IMAGE_URL", // This is the image that will be shown with your skill
  "interactionModelFile": "speechAssets/InteractionModel.json", // intentSchemaFile and sampleUtterancesFile can also be used
  "invocationName": "Skillbot Default",
  "lambdaARN": "arn:aws:lambda:us-east-1:048661040156:function:SkillBotDefault-dev-skill", // url can be used instead
  "name": "Skillbot Default Skill"
}
```

The full set of options are captured here:
https://github.com/skillbotio/client/blob/master/src/ISkillBotConfiguration.ts

If you are using a Lambda, AWS credentials **must** also be set in the environment. They are:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_DEFAULT_REGION [Optional]

## Run the skill uploader
```
skillbot skillbot.json
```

If everything works correctly, it should just say done!

Now you are ready to talk to your skill with Skillbot!
