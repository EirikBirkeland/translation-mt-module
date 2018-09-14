import axios from 'axios';

const BASE_URL = process.env.NODE_ENV !== 'PRODUCTION'
    ? 'http://localhost:3000/'
    : 'https://api.transperfect.com';
const ENDPOINTS = {
    TRANSLATE: "translate",
};

const serverInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: {},
    auth: {
        username: 'eirikbirkeland',
        password: 'foobar'
    },
});

// TODO: decide on name: TranslationService, TranslationProvider, TranslationProxy
// TranslationFetcher, TranslationRetriever
export default class TranslationService {
    submit(payload, cb) {
        return new Promise((resolve, reject) => {
            // make POST request to server's /translate end-point
            // and retrieve an updated machine translation
            serverInstance.post(ENDPOINTS.TRANSLATE, { data: payload }).then((res) => {
                if (res) {
                    resolve(res);
                }
                reject()
            }).catch(function (err) {
                // implementation of handleError has been omitted from this example
                console.warn(err);
            });
        });
    }
};