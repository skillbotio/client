# Setting Up A Skill
## Pre-requisites
This approach to setting up a skill for skillbot assumes you are using the new ASK CLI-style structure.

This means:  
* `skill.json` file at top-level with Skill Manifest info
* `models/en-US.json` file that contains the full interaction model
* `.ask/config` file that contains the Skill ID
* AWS environment variables set for AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY, and AWS_DEFAULT_REGION
(This last one is only necessary for skills hosted via Lambda).
All of this structure is created by default when running `ask new` from the command-line.

More information on the ASK CLI [can be found here](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html).

## Install this client
```
npm install skillbot-client -g
```

## Setup your Skill Configuration
If you configured your skill with ASK, you should be ready to go. The CLI will use skill.json and models/en-US.json to configure your skill for Skillbot.

Additionally, if you are using a Lambda, AWS credentials **must** also be set in the environment. They are:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_DEFAULT_REGION [Optional]

## Run the skill uploader
```
skillbot skill.json
```

If everything works correctly, it should just say done!

Now you are ready to talk to your skill with Skillbot!
