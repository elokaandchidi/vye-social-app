import {createClient} from '@sanity/client';
import { config } from './config';

export const client = createClient({
    projectId: config.sanity.projectId,
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    token: config.sanity.token,
})
