import mockAxios from 'axios';
import TranslationService from './fetcher';

describe('a translation fetcher', () => {
    it('should retrieve an initial translation from the server', async () => {
        const fetcher = new TranslationService();

        const payload = {
            source: "Hello world!",
        };
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                data: 'Hei, verden!',
            })
        );
        await fetcher.submit({ payload }).then(res => {
            expect(res.status).toEqual(200);
            expect(res.data).toEqual('Hei, verden!');
        });
    });

    it('should train the back-end and retrieve an adapted translation', async () => {
        const fetcher = new TranslationService();

        // first, we want to train the server to equate "world" with "jord"
        // rather than the assumed default "verden"
        const trainingPayload = {
            source: "Hello world!",
            target: "hei, jord!"
        };
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                status: 201,
            })
        );
        await fetcher.submit({ trainingPayload }).then(res => {
            expect(res.status).toEqual(201);
        });

        // then, we want to throw the server a new sentence,
        // and expect it to suggest "jord" rather than "verden"
        const payload = {
            source: "The world is great!",
        };
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                data: 'Jorden er flott!',
            })
        );
        await fetcher.submit({ payload }).then(res => {
            expect(res.status).toEqual(200);
            expect(res.data).toEqual('Jorden er flott!');
        });
    });
});