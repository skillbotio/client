import * as request from "request-promise-native";

export class SkillBotClient {
    public constructor(public baseURL: string = "https://skillbot.io") {}

    public message(source: string, channel: string, userID: string, utterance: string): Promise<any> {
        const url = this.baseURL + "/message" +
            "?source=" + source +
            "&channel=" + channel +
            "&userID=" + userID +
            "&utterance=" + utterance;

        const options = {
            json: true,
            method: "GET",
            uri: url,
        };

        return request(options);
    }
}
