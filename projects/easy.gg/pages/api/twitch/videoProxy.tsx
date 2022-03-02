import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { handleAPIError, requireGetParam, requirePostParam } from "../../../helpers/api/helpers";
import request from 'request';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        const videoUrl = requireGetParam('url', 'No data requested', req, res);
        if (videoUrl.includes("twitch")) {
            request(videoUrl).pipe(res);
        } else {
            handleAPIError(null, 'Invalid request', res);
        }
    } catch (err) {
        handleAPIError(err, 'Something went wrong', res);
    }
}