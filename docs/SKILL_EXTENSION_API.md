# Skill Extension API
As much as possible, we seek to allow Alexa skills to run without modification.

However, we do at times:
* Provide additional data so that skills can be enhanced, where useful
* Provide data that is not otherwise available

In the second category is device location information, which is retrieved normally by a call to an external Amazon service
(and is not provided in the standard request payload).

Currently, all extension data is sent as part of the "skillbot" object on the skill payload.

Here is the payload and information on the fields:
```
{
    "skillbot": {
        "countryCode": "US", // Two-letter country-code where the user resides
        "postalCode": "19801", // Postal code where the user resides
        "source": "SLACK" // Where this call came from - only current value is SLACK
    }
}
```

Additional data will be added as needed.