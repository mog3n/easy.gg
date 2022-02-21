import axios, { AxiosResponse } from "axios";
import { QueryFunctionContext, useQuery } from "react-query"
import { TWITCH_API_URL } from "../../constants";
import { ClipVideoDataResponse, GetTwitchClipsResponse, SearchTwitchCreatorResponse } from "../../types/twitchTypes";

export const useGetTwitchClipsFromBroadcasterID = (broadcaster_id: string) => {
    return useQuery<AxiosResponse<GetTwitchClipsResponse>>(
        ['clips', broadcaster_id],
        (queryContext => {
            return axios.get<GetTwitchClipsResponse>(`/api/twitch/getClipsFromUser`, {
                params: {
                    broadcaster_id,
                }
            });
        }), {enabled: broadcaster_id !== ''});
}

export const useSearchTwitchCreators = (query: string) => {
    return useQuery<AxiosResponse<SearchTwitchCreatorResponse>>(
        ['search_creators', query],
        (queryContext => {
            return axios.get<SearchTwitchCreatorResponse>('/api/twitch/searchChannels', {
                params: {
                    q: query
                }
            })
        }),
        { enabled: query !== ''}
    )
}

export const useGetClipMP4Data = (twitchClipURL: string) => {
    return useQuery<AxiosResponse<ClipVideoDataResponse>>(
        ['search_creators', twitchClipURL],
        (queryContext => {
            return axios.get<ClipVideoDataResponse>('/api/twitch/getClipVideoData', {
                params: {
                    twitchURL: twitchClipURL
                }
            })
        }), 
        {enabled: twitchClipURL !== ''}
    )
}