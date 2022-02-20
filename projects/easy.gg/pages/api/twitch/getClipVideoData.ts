// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { requireGetParam } from '../../../helpers/api/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const twitchURL = requireGetParam('twitchURL', 'Require a valid twitch url', req, res);
  
  const urlArray = twitchURL.split("/")
  const slug = urlArray[urlArray.length-1];

  const data = await axios.post(`https://gql.twitch.tv/gql`, {
    "operationName":"VideoAccessToken_Clip",
    "variables":{"slug": slug},
    "extensions":{
      "persistedQuery":{
        "version":1,
        "sha256Hash":"9bfcc0177bffc730bd5a5a89005869d2773480cf1738c592143b5173634b7d15"
      }
    }
  }, {
    headers: {
      "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
      "Content-Type": "text/plain;charset=UTF-8",
      "Origin": "https://clips.twitch.tv",
      "Referrer": `https://clips.twitch.tv/${slug}`,
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
    }
  })

  res.status(200).send({data: data.data})
}
