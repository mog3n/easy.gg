import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { TWITCH_API_URL } from "../../../constants";
import { axiosTwitch, handleAPIError, requireGetParam } from "../../../helpers/api/helpers";
import { GetTwitchClipsResponse } from "../../../types/twitchTypes";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        const broadcaster_id = requireGetParam('broadcaster_id', 'Broadcaster ID is missing', req, res);
        const clipsResponse = await axiosTwitch.get<GetTwitchClipsResponse>(`${TWITCH_API_URL}/clips`, {
            params: {
                broadcaster_id: broadcaster_id,
            },
        });
        res.status(200).send(clipsResponse.data);
    } catch (e) {
        handleAPIError(e, 'An error occured', res);
    }
}