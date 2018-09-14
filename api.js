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

class Fetcher {
	constructor(id) {
		this.segmentId = id;
	}

	submit(payload, cb) {
		// make POST request to server's /translate end-point
		// and retrieve an updated machine translation
		serverInstance.post(ENDPOINTS.TRANSLATE, { data: payload }, (res) => {
			if (res) {
				return cb(res);
			}
		}).catch(function (err) {
			// implementation of handleError has been omitted from this example
			handleError(err);
		});
	}
};

// hypothetical back-end data
const rawSegmentData = [
	{
		id: 1,
		source: "Hello world",
		target: "こんにちは世界",
		tags: [
			{
				id: 1,
				content: 'b',
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
				id: 1,
				content: 'em',
				startIndex: 7,
				length: 3,
			},
		],
		_sourceOriginal: "Apples <em>and</em> oranges!",
	}
];

// The Segment class is used to instantiate
// segment abstractions from the editor's perspective
class Segment {
	constructor(rawSegmentData) {
		const { source, target, tags, id } = rawSegmentData;
		this.id = id;
		this.source = source;
		this.target = target;
		this.suggestion = null;
		this.tags = tags;
		this.fetcher = new Fetcher(this.id);
	}
	updateSuggestion(cb) {
		this.fetcher.submit(this.target, res => {
			return cb(res);
		})
	}
	setSuggestion(newMtSuggestion) {
		this.suggestion = newMtSuggestion;
	}
	/* Additional methods omitted... */
}

const editorSegments = rawSegmentData.map(x => new Segment(x));

document.addEventListener('segmentTranslationChanged', event => {
	const changedSegmentId = event.detail.segmentId;
	const index = changedSegmentId - 1;

	editorSegments[index].updateSuggestion(res => {
		const { mtSuggestion } = res.data.mtSuggestion;

		editorSegments[index].setSuggestion(mtSuggestion);
	});
});