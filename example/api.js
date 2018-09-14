import TranslationService from '../lib/fetcher';

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
		this.fetcher = new TranslationService(this.id);
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

document.addEventListener('segmentTranslationChanged', async (event) => {
	const changedSegmentId = event.detail.segmentId;
	const index = changedSegmentId - 1;

	const res = await editorSegments[index].updateSuggestion();
	const { mtSuggestion } = res.data.mtSuggestion;
	editorSegments[index].setSuggestion(mtSuggestion);
});