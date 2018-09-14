import mockAxios from 'jest-mock-axios';

describe('a translation fetcher', () => {
    it('should retrieve an initial translation from the server', (done) => {

        const payload = {
            source: "Hello world",
            target: "Hei, verden!",
        }

        const thenFn1 = jest.fn(res => {
            expect(res.status).toEqual(200);
            expect(res.data).toEqual('server says hello!')
            done();
        });

        mockAxios.post('/translate', { data: payload }).then(thenFn1);

        const firstRequestInfo = mockAxios.lastReqGet();

        mockAxios.mockResponse({ data: 'server says hello!' }, firstRequestInfo);
        expect(thenFn1).toHaveBeenCalled();
    });
    it('should retrieve an adapted translation from the server', () => {

    });
});