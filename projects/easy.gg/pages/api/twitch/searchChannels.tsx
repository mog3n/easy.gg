import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { TWITCH_API_URL } from "../../../constants";
import { axiosTwitch, handleAPIError, requireGetParam } from "../../../helpers/api/helpers";
import { SearchTwitchCreatorResponse } from "../../../types/twitchTypes";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const searchQuery = requireGetParam('q', 'No search query', req, res);
    try {
        const searchResult = await axiosTwitch.get<SearchTwitchCreatorResponse>(`${TWITCH_API_URL}/search/channels`, {
            params: {
                query: searchQuery
            }
        })
        res.status(200).send(searchResult.data);
    } catch (e) {
        handleAPIError(e, 'Could not complete your request', res);
    }
    
}