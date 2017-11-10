[![CircleCI](https://circleci.com/gh/skillbotio/client.svg?style=svg&circle-token=99112ca7ffc59b0d4d5604ff7fdda32abe84e214)](https://circleci.com/gh/skillbotio/client)
[![codecov](https://codecov.io/gh/skillbotio/client/branch/master/graph/badge.svg?token=MXXLxo9NlP)](https://codecov.io/gh/skillbotio/client)
[![npm](https://img.shields.io/npm/v/skillbot-client.svg)](https://npmjs.com/package/skillbot-client)
# What is this?
Skillbot allows you to interact with Alexa skills via Slack (and soon other platforms as well). Here is a quick demo:
<kbd><img style="border: 2px solid black;" src="https://raw.githubusercontent.com/skillbotio/client/master/docs/SkillbotDemo.gif" width="600" /></kbd>

To try it out initially, join the Bespoken Bots slack channel. [Get an invite here](https://slofile.com/slack/bespokenbots).

# Setup
To work, Skillbot needs to get some information about your skill - specifically, how to call it (URL or Lambda) and the interaction model:
* [Skill Configuration *Classic*](docs/SKILL_SETUP_CLASSIC.md): Configure a skill with Skillbot using the "classic" structure (IntentSchema.json and SampleUtterances.txt)
* [Skill Configuration *ASK*](docs/SKILL_SETUP_ASK.md): Configure a skill with Skillbot using the ASK CLI structure (skill.json and models/en-US.json)

Additionally, we have APIs for working with Skillbot:  
* [Skill Extension API](docs/SKILL_EXTENSION_API.md): Learn about how Skillbot augments the standard Alexa payload
* [Skillbot Client API](docs/SKILLBOT_CLIENT_API.md): Integrate Skillbot into your own client or project

# Limitations
Skillbot does not currently support:
* The AudioPlayer (yet!)
* Account Linking (yet!)
* The Read or Write Lists Permission

And location is **available**, but via an auxiliary element in the request payload.
```
{
    "skillbot": {
        "countryCode": "US", // Two-letter country-code where the user resides
        "postalCode": "19801", // Postal code where the user resides
        "source": "SLACK" // Where this call came from - only current value is SLACK
    }
}
```
More [details here](https://github.com/skillbotio/client/blob/master/docs/SKILL_EXTENSION_API.md).

# Contributing
Skillbot is based on the [Virtual Alexa](https://github.com/bespoken/virtual-alexa).

The core behavior for emulating Alexa and making skills work resides there.

# Talk to us
We are on [Gitter](https://gitter.im/bespoken/bst), as well as in the [Alexa Slack channel](http://alexaslack.com) (@jpkbst).
