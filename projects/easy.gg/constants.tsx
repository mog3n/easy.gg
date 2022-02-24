import { isClient } from "./helpers/helpers";

export const LANDING_MOBILE_BREAKPOINT = '700px';
export const TWITCH_API_URL = 'https://api.twitch.tv/helix';
export const getBaseUrl = () => isClient() ? `${window.location.protocol}//${window.location.host}` : '';