import axios from "axios";
import request from 'request';
import { NextApiRequest, NextApiResponse } from "next";
import { handleAPIError, requireGetParam, requirePostParam } from "../../../helpers/api/helpers";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        const videoUrl = requireGetParam('url', 'No data requested', req, res);
        request(videoUrl).pipe(res);
    } catch (err) {
        handleAPIError(err, 'Something went wrong', res);
    }
}