import mockAxios from 'axios';
import Fetcher from './fetcher';

describe('a translation fetcher', () => {
    it('should retrieve an initial translation from the server', (done) => {
        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                data: 'Hei, verden!',
            })
        );

        const payload = {
            source: "Hello world!",
        };

        const fetcher = new Fetcher();

        const fn1 = jest.fn(res => {
            expect(res.status).toEqual(200);
            expect(res.data).toEqual('Hei, verden!');
            done();
        });

        fetcher.submit({ payload }).then(fn1);
    });

    it('should retrieve the expected adapted translation from the server', async (done) => {
        const fetcher = new Fetcher();
        
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
            done();
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
            done();
        });
    });
});