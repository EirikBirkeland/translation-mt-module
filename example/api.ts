//  General comments
//
//
//
//

// TODO: How can I avoid defining stuff in RawSegmentData and in Segment twice?

import TranslationService from '../lib/fetcher';

interface Tag {
	// a identifier that's unique within the context; may coincide with original order
	readonly id: number;

	// the actual tag contents, e.g. strong, span, div
	content: string;

	// the starting index for the tag in the text-only version of the translation unit
	startIndex: number;

	// the span/length of the tag. The closing position is determined by looking at startIndex and length.
	// E.g. A length of 1 would indicate a 'collapsed' tag.
	length: number;
}

interface RawSegmentData {
	// a segment identifier
	readonly id: number;
	// the source text without tags
	source: string;
	// the target string without tags
	target: string;
	// tags
	tags: Array<Tag>;
	// original source
	_sourceOriginal?: string;
}

// hypothetical back-end data
const rawSegmentData:Array<RawSegmentData> = [
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
	// a readonly unique identifier
	readonly id: number;
	// the source string without tags
	source: string;
	// the target string without tags
	target: string;
	// the latest translation fetched from back-end
	suggestion: null|string;
	// metadata allowing for dynamic reconstruction of segment with tags
	originalTags: Array<Tag>;
	// the user's tag positioning in the editor will be reflected here
	userDefinedTags: null|Array<Tag>;
	// an injected translation service
	fetcher: TranslationService;

	constructor(rawSegmentData) {
		const { source, target, tags, id } = rawSegmentData;
		this.id = id;
		this.source = source;
		this.target = target;
		this.suggestion = null;
		this.originalTags = tags;
		this.userDefinedTags = null;
		this.fetcher = new TranslationService();
	}
	updateSuggestion(cb?: Function) {
		this.fetcher.submit(this.target, (res) => {
			if(cb) { return cb(res) };
		});
	}
	setSuggestion(newMtSuggestion) {
		this.suggestion = newMtSuggestion;
	}
	/* Additional methods omitted... */
}

const editorSegments = rawSegmentData.map(x => new Segment(x));

// for the sake of this example, I have assumed that
// the editor will issue a `segmentTranslationChanged` event
document.addEventListener('segmentTranslationChanged', async (event: CustomEvent) => {
	const changedSegmentId = event.detail.segmentId;
	const index = changedSegmentId - 1;

	const res: any = await editorSegments[index].updateSuggestion();
	const { mtSuggestion } = res.data.mtSuggestion;
	editorSegments[index].setSuggestion(mtSuggestion);
});