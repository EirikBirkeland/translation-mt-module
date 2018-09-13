const BASE_URL = process.env.NODE_ENV !== 'PRODUCTION' ? 'http://localhost:3000/' : 'https://api.superlsp.com';
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
		// make POST request to server including user's latest input
		// TODO(eirik): how to use ENDPOINTS.TRANSLATE WITH serviceInstance?
		serverInstance.post(ENDPOINTS.TRANSLATE, { payload: payload }, (res) => {
			if (res) {
				return cb(res);
			}
		}).catch(function (err) {
			// handle error
		});
	}
};

// Hypothetical back-end data
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

// The Segment class is used to instantiate segment abstractions from the editor's perspective
class Segment {
	constructor (rawSegmentData) {
		const { source, target, tags, id } = rawSegmentData;
		this.id = id;
		this.source = source;
		this.target = target; // we assume that this.target is bound to the editor implementation's user-manipulable editor, and that this data is changed
		this.suggestion = null;
		this.tags = tags;
		this.fetcher = new Fetcher(this.id);
	}
	updateSuggestion (cb) {
		this.fetcher.submit(this.target, res => {
			return cb(res);
		})
	}
	setSuggestion (newMtSuggestion) {
		this.suggestion = newMtSuggestion;
	}
	/* Additional methods omitted... */
}

const editorSegments = rawSegmentData.map(x => new Segment(x));

// For the sake of this example, we assume that user input causes event segmentTranslationChanged to be dispatched,
// and we do so in a framework-agnostic manner (hence addEventListener rather than a Angularjs or a Reactjs specific method)
document.addEventListener('segmentTranslationChanged', event => {
	const changedSegmentId = event.detail.segmentId;
	const index = changedSegmentId - 1;

	editorSegments[index].updateSuggestion(res => {
		const { mtSuggestion } = res.data.mtSuggestion;
	
		editorSegments[index].setSuggestion(mtSuggestion);
	});
});