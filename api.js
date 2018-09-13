const rawSegmentData = [
	{
		id: 1,
		source: "Hello world",
		target: "こんにちは世界",
		tags: [
			{
				startIndex: 0,
				length: 4,
			},
		],
		_sourceOriginal: "<b>Hello</b> world",
	},
	{
		id: 2,
		source: "Apples and oranges!",
		target: "リンゴとオレンジ",
		tags: [
			{
				startIndex: 7,
				length: 3,
			},
		],
		_sourceOriginal: "Apples <em>and</em> oranges!",
	}
];

// segment factory to wrap the raw data with convenience methods
function segment (id) {
	const segments = rawSegmentData;

	return function () {
		const seg = segments[id-1];
		return {
			get sourceText () { return seg.source },
			get targetText () { return seg.target },
		}
	}
}

const BASE_URL = process.env.NODE_ENV !== 'PRODUCTION' ? 'http://localhost:3000/' : 'https://api.superlsp.com';

const serverInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 8000,
	headers: {},
	auth: {
		username: 'eirikbirkeland',
		password: 'foobar'
	},
});

const ENDPOINTS = {
	TRANSLATE: "translate",
};

class Fetcher {
	constructor(id) {
		this.segmentId = id;
	}

	submit(cb) {
		// make POST request to server including user's latest input
		serverInstance.post(ENDPOINTS.TRANSLATE, (res) => {

		}).catch(function (err) {
			// handle error
		});

		if (res) {
			return cb(res);
		}
	}
};

const updatedUserTranslation = "Hello there";
const someSegment = new Fetcher();

someSegment.submit(updatedUserTranslation, res => {
	const { MTSuggestion } = res;

	segment(someSegment.segmentId).updateSuggestion(MTSuggestion);
});