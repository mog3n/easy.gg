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

  //sig=7cf757c46a0872c9d28c548b4db3131f91cd3951&token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22clip_uri%22%3A%22https%3A%2F%2Fproduction.assets.clips.twitchcdn.net%2FAT-cm%257C984234660.mp4%22%2C%22device_id%22%3A%22Q0cvNaMIN70sPl2dPkysITsXTiemUqef%22%2C%22expires%22%3A1645555610%2C%22user_id%22%3A%2224030034%22%2C%22version%22%3A2%7D

  const data = await axios.post(`https://gql.twitch.tv/gql`, {
    "operationName":"VideoAccessToken_Clip",
    "variables":{"slug": slug},
    "extensions":{
      "persistedQuery":{
        "version":1,
        "sha256Hash":"36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11"
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
  });

  // In case the sha256 hash expires for some reason
  // const httpLink = new HttpLink({ uri: 'https://gql.twitch.tv/gql' });
  // const persistedQueriesLink = createPersistedQueryLink({ sha256 });
  // const client = new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link: persistedQueriesLink.concat(httpLink),
  // })

  // const GET_VIDEO_DATA = gql`
  //   query VideoAccessToken_Clip {
  //     slug: ${slug}
  //   }
  // `
  // const resp = await client.query({
  //   query: GET_VIDEO_DATA,
  //   variables: { slug },

  // })
  // console.log(resp);

  res.status(200).send({data: data.data.data})
}
