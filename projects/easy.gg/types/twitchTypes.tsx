export interface TwitchClip {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: number;
}
export interface GetTwitchClipsResponse {
    data: TwitchClip[]
}

/* Example Response
    {
      "broadcaster_language": "en",
      "broadcaster_login": "a_seagull",
      "display_name": "A_Seagull",
      "game_id": "506442",
      "game_name": "DOOM Eternal",
      "id": "19070311",
      "is_live": true,
      "tags_ids": [
        "6ea6bca4-4712-4ab9-a906-e3336a9d8039"
      ],
      "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/a_seagull-profile_image-4d2d235688c7dc66-300x300.png",
      "title": "a_seagull",
      "started_at": "2020-03-18T17:56:00Z"
    }
*/
export interface TwitchCreator {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    tag_ids: string[];
    thumbnail_url: string;
    title: string;
    started_at: string;
}
export interface SearchTwitchCreatorResponse {
    data: TwitchCreator[]
}

interface VideoQuality {
    framerate: number;
    quality: string;
    sourceURL: string;
}

interface PlaybackAccessToken {
    signature: string;
    value: string;
}

export interface ClipVideoData {
    id: string;
    videoQualities: VideoQuality[];
    playbackAccessToken: PlaybackAccessToken;
}

export interface ClipVideoDataResponse {
    data: {
        clip: ClipVideoData
    }
}