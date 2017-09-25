# Skillbot Client API
The Skillbot Client API allows one to build their own bots and services based on skillbot.

If you want to, say, enable twitter for Alexa skills, this is your ticket!

The API is straightforward, with only a single call.

## Skillbot Message call
### Request
**Endpoint**: /message

**Method**: GET

**Parameters**:
* channel: String - \[Optional\] The name of the channel this came from
* source: String - Where the message came from (for example, TWITTER or SLACK)
* userID: String - The unique ID of the user - unique within each source
* utterance: String - What the user said (or typed)

The channel parameter is relevant for platforms like Slack,
where a user might be interacting with skillbot simultaneously across several different channels.

Within each channel, they will have their own separate session.

### Response
**Content Type**: application/json

**Payload**
```
{
    card: { // [OPTIONAL]
        content: string, // [OPTIONAL] The text content of the card
        imageURL: string, // [OPTIONAL] The image URL for the card
        subTitle: string, // [OPTIONAL] The subTitle of the card
        title: string, // [OPTIONAL] The title of the card
    },
    raw: any, // The raw skill response
    sessionEnded: boolean, // Whether the session ended
    skill: {
        name: string, // The name of the skill that responded
        imageURL: string, // [OPTIONAL] Image identifying the skill that responded
    };
    streamURL: string, // [OPTIONAL] If the response is a stream, the URL for the stream
    text: string, // [OPTIONAL] The text response of the skill
}
```

The payload pulls out key data from the skill response. One can always just ignore it and go straight to the `raw` element to see the actual full payload from the skill.
