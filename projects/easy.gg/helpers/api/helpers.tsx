import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const requireGetParam = (param: string, error: string, req: NextApiRequest, res: NextApiResponse): string => {
    if (!req.query[param]) {
        res.status(400).send({error});
    }
    return req.query[param] as string;
}

export const requirePostParam = (param: string, error: string, req: NextApiRequest, res: NextApiResponse): string => {
    if (!req.body[param]) {
        res.status(400).send({error});
    }
    return req.body[param]
}

export const handleAPIError = (e: unknown, errorMessage: string, res: NextApiResponse) => {
    console.error(e);
    res.status(500).send({error: errorMessage});
}

export const axiosTwitch = axios.create({
    headers: {
        "Client-Id": "8fdbbgpdexxwufebasf2kg28a3bszz",
        "Authorization": `Bearer x8ja1ve0vlyzwwyvutvtdkanurhdk6`,
    }
})