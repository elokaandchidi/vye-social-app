import {createClient} from '@sanity/client';
import { config } from './config';

export const client = createClient({
    projectId: config.sanity.projectId,
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2024-02-02',
    token: config.sanity.token,
    ignoreBrowserTokenWarning: true
})
