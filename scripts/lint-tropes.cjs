#!/usr/bin/env node
/**
 * lint-tropes.cjs - mechanical gate for AI-writing tropes in swapbiswas.com blog posts.
 *
 * Source catalog: https://tropes.fyi/tropes-md (49 tropes). Site rulebook with the
 * carve-outs this script honours: .claude/writing-tropes.md
 *
 * Usage:
 *   node scripts/lint-tropes.cjs src/content/blog/<slug>.md [more.md ...]   one or more posts
 *   node scripts/lint-tropes.cjs --all                                        whole corpus, ranked (any cwd)
 *   flags: --json (machine output) --quiet (summary only) --strict (WARN counts as FAIL)
 *          --baseline=before.json (only hits NEW vs that earlier --json run fail the gate)
 *
 * Exit codes: 0 = no FAIL hits (WARN allowed) | 1 = at least one FAIL | 2 = usage / tooling error
 * Last line of human output is always "TROPE GATE: PASS" or "TROPE GATE: FAIL" - read that line.
 * Exit 2 prints a "lint-tropes:" error and no gate line - that is a tooling failure, never a pass.
 *
 * What it can catch: word-level tells, signposting, negative parallelism, rhetorical self-questions,
 * vague attributions, staccato fragments, anaphora, Wh-/mixed-case headings, bold-first bullet
 * blocks, magic adverbs, promotional vocabulary, unicode punctuation, unclosed code fences.
 * What it cannot catch (judgment tropes - covered by the Step 11 self-audit in /swapblog):
 * premise stacking, self-echo, synonym cycling, one-point dilution, plain-text quotable one-liners,
 * forced metaphors, belaboring, never-ending conclusion, rule-of-three stacking, comma-clipped tails.
 *
 * Text inside double quotes (and space-delimited single quotes) is treated as quoted material -
 * sample prompts, competitor copy, scripted questions - and is not linted except for unicode.
 */
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------------------------------
 * CLI
 * ---------------------------------------------------------------------------------------- */
const KNOWN_FLAGS = new Set(['--all', '--json', '--quiet', '--strict', '--baseline']);
const args = process.argv.slice(2);
function usage(msg) {
	if (msg) console.error(`lint-tropes: ${msg}`);
	console.error('usage: node scripts/lint-tropes.cjs <post.md ...> | --all  [--json] [--quiet] [--strict] [--baseline=before.json]');
	process.exit(2);
}
const flags = new Set();
let baselineArg = null;
let files = [];
for (const a of args) {
	if (a.startsWith('--')) {
		const name = a.split('=')[0];
		if (!KNOWN_FLAGS.has(name)) usage(`unknown flag ${a}`);
		if (name === '--baseline') {
			if (!a.includes('=') || a.split('=').slice(1).join('=').trim() === '') usage('--baseline needs a value: --baseline=before.json');
			baselineArg = a.split('=').slice(1).join('=');
		}
		flags.add(name);
	} else {
		if (!/\.(md|mdx|markdown)$/i.test(a)) usage(`not a markdown file: ${a}`);
		files.push(a);
	}
}
if (flags.has('--all')) {
	const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
	try {
		files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));
	} catch (e) { usage(`could not list corpus at ${dir}: ${e.message}`); }
}
if (files.length === 0) usage();

let baseline = null; // { lineHits: Set('base|id|snippet'), postHits: Map('base|id' -> count) }
if (baselineArg) {
	try {
		const b = JSON.parse(fs.readFileSync(baselineArg, 'utf8'));
		baseline = { lineHits: new Set(), postHits: new Map() };
		for (const r of b.results || []) {
			for (const h of r.hits || []) {
				const base = path.basename(r.file);
				if (h.line === 0) baseline.postHits.set(`${base}|${h.id}`, Math.max(baseline.postHits.get(`${base}|${h.id}`) || 0, h.count || 1));
				else baseline.lineHits.add(`${base}|${h.id}|${h.snippet}`);
			}
		}
	} catch (e) { usage(`could not read baseline ${baselineArg}: ${e.message}`); }
}

const NUM = '(?:two|three|four|five|six|seven|eight|nine|ten|\\d+)';
const rx = (s, f = 'i') => new RegExp(s, f);

/* ------------------------------------------------------------------------------------------
 * Line-level regex tropes.
 * scope: 'all' (frontmatter title/description/faq answers + body) or 'body'.
 * sev:   'fail' (any hit blocks) | 'warn' (judgment call, reported) | 'count' (thresholded below).
 * ---------------------------------------------------------------------------------------- */
const LINE_RULES = [
	// --- formatting / unicode (duplicates the punctuation gate on purpose; belt and braces) ---
	{ id: 'unicode-decoration', sev: 'fail', scope: 'all', raw: true,
		re: rx('[\\u2012-\\u2015\\u2018\\u2019\\u201C\\u201D\\u2190-\\u2194\\u21D2\\u2022\\u2026]', ''),
		hint: 'plain ASCII only: " - ", straight quotes, "->" spelled out or rewritten' },
	{ id: 'ascii-em-dash', sev: 'fail', scope: 'all',
		re: rx('\\s--\\s|\\w--\\w', ''),
		hint: 'a double hyphen is an em-dash in disguise; use " - " or rewrite' },

	// --- signposting family ---
	{ id: 'signposted-conclusion', sev: 'fail', scope: 'body',
		re: rx('\\b(in conclusion|to sum up|in summary|to summari[sz]e|to wrap (this |it |things )?up|wrapping up|all in all|at the end of the day|to conclude|in closing|to close,|the bottom line is|long story short|net-net|(^|[.!?]\\s+)(bottom line|(key )?takeaways?|the takeaway|final (thought|word|note)s?|ultimately)[:,])(?![a-z])'),
		hint: 'just end; the reader can feel a conclusion without a label' },
	{ id: 'fractal-summary', sev: 'fail', scope: 'body',
		// sentence-initial "In this post ..." or "in this guide we'll cover" is signposting; a mid-sentence "the template in this post" is a plain reference and is left alone
		re: rx("(^|[.!?]\\s+)in this (section|post|article|guide|piece)\\b|\\bin this (section|post|article|guide|piece),? (we|i|you)('?ll| will| have|'?ve| are)? ?(explore|cover|walk|look|break|show|learn|see|discuss|examine|dig|go)\\b|\\bas (we|i|you)'?(ve| have)? (seen|covered|discussed|explored|saw|noted)( above| so far| earlier)?\\b|\\bas (discussed|mentioned|noted|covered|outlined|explained|said) (above|earlier|previously|before)\\b|\\b(let'?s |to |quick |a )?recap[:,]|\\b(let'?s |to )recap\\b|\\bas (i|we) said (above|earlier)\\b|\\b(the|this) (section|post|article|guide) (that follows|ahead|below) (covers|explains|walks|shows)\\b|\\bby the end of this (post|article|guide|piece)\\b|\\bthe rest of this (post|article|guide|piece)\\b|\\beverything above (points|adds up)\\b|\\bwhat follows is (the|a|my)\\b|(^|[.!?]\\s+)below, |\\bin the (sections?|paragraphs?) (below|above|that follow)\\b"),
		hint: 'no "what I am about to say / what I just said" - delete the sentence or say the thing' },
	{ id: 'tie-back', sev: 'fail', scope: 'body',
		re: rx("\\b(so,? to answer (your|the) question|to bring (it|this) back (to|around)|circling back|coming back to (what|the question)|(^|[.!?]\\s+)in short,|which brings (us|me) back to|back to the (headline|original|opening|main|first) question)(?![a-z])"),
		hint: 'stop once the answer is given; no loop back to the question' },
	{ id: 'filler-transition', sev: 'fail', scope: 'body',
		re: rx("\\b((it'?s|it is) (also |certainly |probably |definitely |always |perhaps )?worth (noting|mentioning|pointing out|remembering|highlighting|saying|adding|flagging|stressing|emphasi[sz]ing|calling out)|(^|[.!?]\\s+)worth (noting|mentioning|flagging|saying)[:,]|it (should|must) be (noted|said|mentioned|stressed|acknowledged)|(it'?s|it is) (important|useful|helpful|crucial|critical) to (note|remember|mention|point out|acknowledge|understand) that|it bears (mentioning|repeating|noting)|needless to say|it goes without saying|(^|[.!?]\\s+)of note,|one thing worth (flagging|noting|mentioning))(?![a-z])"),
		hint: 'cut the frame; state the point' },
	{ id: 'filler-adverb-opener', sev: 'fail', scope: 'body',
		re: rx('(^|[.!?]\\s+)(importantly|interestingly|notably|crucially|significantly|remarkably)( enough)?,\\s'),
		hint: 'sentence-opening "Importantly," / "Interestingly," signals nothing - delete it' },
	{ id: 'heres-the-kicker', sev: 'fail', scope: 'body',
		re: rx("\\b(here'?s the (kicker|thing|catch|rub|twist|part|problem|reality)|but here'?s (the|what|where)|here'?s what (most|nobody|no one|few)|here'?s (why|where) (it|this|that) gets|nobody talks about this|what (most people|nobody|no one|few people) (miss|misses|get wrong|gets wrong|tell you|tells you|mention|mentions|realise|realize|notice)( is| about)?|this is where it gets (interesting|tricky|hard|uncomfortable|messy)|the (uncomfortable|hard|inconvenient|unpopular|honest) truth is|the part nobody (mentions|talks about|tells you)|(^|[.!?]\\s+)the (catch|kicker|twist|rub)[:,]|(and )?this is the (part|bit) that (matters|counts))(?![a-z])"),
		hint: 'false suspense; state the point without the drum roll' },
	{ id: 'lets-dive-in', sev: 'fail', scope: 'body',
		re: rx("\\b(let'?s (dive|dig|jump) (in|into|deeper|right in)|let'?s (break (this|it|that|each one|these) down|unpack|explore|delve|take a (closer|deeper|quick) look|get (started|into it)|start (with|by)|begin (with|by)|walk through|look at how|see how|talk about|zoom (out|in)|step back|take a step back|take stock|look at the numbers|look at (an|some) example)|let me (walk you through|break (this|it) down|explain|unpack))\\b"),
		hint: 'teacher voice; drop the invitation and start' },
	{ id: 'deep-dive', sev: 'warn', scope: 'body',
		re: rx('\\b(deep dive|dive (into|deeper)|a deeper look at)\\b'),
		hint: '"deep dive" is model vocabulary; say "detail", "breakdown", or name the section by its content' },
	{ id: 'think-of-it-as', sev: 'fail', scope: 'body',
		// "treat it as a checklist" is an instruction, not an analogy, and is left alone
		re: rx("\\b(think of (it|this|them|that|[a-z]+) (as|like)|imagine (it|this) as|picture (this|it)(?=[:.,])|it'?s like (a|an) [a-z]+( [a-z]+){0,3} for|(it'?s|it is|this is|that'?s) (basically|essentially|effectively) (a|an) [a-z]+( [a-z]+){0,3} for|the analogy i use|a useful (mental model|analogy|way to think about it)[:,]|the [a-z]+ equivalent of (a|an))(?![a-z])"),
		hint: 'patronizing analogy; explain the thing itself' },
	{ id: 'imagine-a-world', sev: 'fail', scope: 'body',
		re: rx('\\b(imagine (a|an) [a-z ]{3,30} where|in a world where|picture a [a-z]+ where|imagine (if|that) you could|imagine if (every|all|each|your|you|we)|now imagine)\\b'),
		hint: 'futurism invitation; describe what actually happens' },
	{ id: 'in-todays-landscape', sev: 'fail', scope: 'all',
		re: rx("\\bin today'?s (fast-paced |digital |ever-changing |ever-evolving |competitive |modern |crowded |noisy |ai-driven |ai-first |data-driven )?(world|landscape|market|marketplace|economy|environment|business|era|age)\\b"),
		hint: 'zero-information opener; start with the specific' },
	{ id: 'despite-challenges', sev: 'fail', scope: 'body',
		re: rx('\\bdespite (these|its|their|the|such|those) (challenges|hurdles|obstacles|limitations)\\b|\\bdespite (its|their) [^.,\\n]{3,60}, [^.\\n]{3,60} (faces?|facing) (several |some |many )?challenges\\b|\\bfor all its (flaws|limitations|faults|problems|shortcomings)\\b|\\bcaveats aside\\b|\\bfaces (several |some |many |real |its share of )?(challenges|hurdles|headwinds), (but|yet)\\b|\\bcontinues to thrive\\b|\\b(but|yet) (it |the [a-z]+ )?(still )?holds up\\b'),
		hint: 'acknowledge-then-dismiss formula; either the challenge matters or cut it' },
	{ id: 'reasoning-leak', sev: 'fail', scope: 'body',
		re: rx("\\b(i want to be (clear|exact|precise|careful|honest|specific)|i should (be clear|say|note|add)|let me be (clear|precise|exact|specific)|to be clear,|it'?s worth being precise|i want to (spend a moment|pause here|flag|be upfront)|what (this|that) changes is|before (i|we) (go|get) (on|further|into)|i'?ll be (careful|precise|exact|specific|honest) (here|with|about)|i will be (honest|clear|precise) about|which is to say|it helps to be (precise|clear|exact|specific) here|it is worth being (careful|precise|clear)|i'?m going to resist|what follows is the part|let me (put this|say this|flag|be precise)|one caveat before|i'?ll say this plainly)(?![a-z])"),
		hint: 'narrating the writing instead of writing; delete and make the point' },
	{ id: 'preamble-announcer', sev: 'warn', scope: 'body',
		re: rx('(^|[.!?]\\s+)(' + NUM + '|several|a few) (things|constraints|factors|points|rules|reasons|questions|patterns|forces|ideas|caveats|principles|lessons|takeaways|inputs|levers|signals|mistakes|numbers|habits|shifts|trends) (shape|shapes|drive|drives|matter|matters|define|defines|explain|explains|determine|determines|decide|decides|separate|separates|are worth|stand out|follow|apply|come up|are (reshaping|changing|driving)|is (reshaping|changing|driving)|will|have|has)\\b'),
		hint: 'announce-then-answer; drop the announcer and go straight to the items' },
	{ id: 'more-important-point', sev: 'warn', scope: 'body',
		re: rx("\\bthe (more |most |real |bigger |larger )?(important|interesting|useful) (point|thing|part|question|takeaway) (is|here is|is that|is not|isn'?t)\\b|\\bthe (bigger|larger|broader|real|deeper|key|main|central|actual) (point|question|issue|lesson|takeaway|problem) (is|here is|is that)\\b"),
		hint: 'throat-clearing frame; say the point' },
	{ id: 'compulsive-counting', sev: 'warn', scope: 'body',
		re: rx("\\b(there are|here are|i see|i count|i'?ll (cover|walk through|share|give you)|let'?s look at|this (post|guide|article) (covers|gives you)) (the )?(" + NUM + ') (things|reasons|ways|lessons|takeaways|points|rules|steps|constraints|factors|mistakes|signals|questions|patterns|tactics|examples|tips|that matter)\\b|(^|[.!?]\\s+)(' + NUM + ') (things|reasons|ways|lessons|takeaways|points|rules|constraints|factors|mistakes|signals|questions|patterns|tactics|examples|tips)(,| (we|i|you|to|that|worth|this|it|why|these|those|for))\\b'),
		hint: 'do not announce the count; the list shows it (listicle titles and H2s are exempt)' },

	// --- sentence-structure tells ---
	{ id: 'not-x-not-y-just-z', sev: 'fail', scope: 'body',
		re: rx("\\bnot (a |an |the )?[^.!?\\n]{1,40}\\. not (a |an |the )?[^.!?\\n]{1,40}\\.( (just|but|only|simply) |\\s+[A-Z])|\\b(it|this|that) (is|was) not [^.!?\\n]{1,40}\\. (it|this|that) (is|was) not [^.!?\\n]{1,40}\\. (it|this|that) (is|was) |(^|[.!?]\\s+)not (a |an |the )?[^,.!?\\n]{1,30}, not (a |an |the )?[^,.!?\\n]{1,30}, (just|but|only|simply) "),
		hint: '"Not X. Not Y. Just Z." tension builder; state Z' },
	{ id: 'negative-parallelism', sev: 'count', scope: 'body',
		// the tell is the sentence-broken contrast "X isn't A. X is B." - keyed on the negated copula, any subject; a plain "the goal is not to X" with no pivot is left alone
		re: rx("\\b(the (real |actual |bigger |true )?(question|issue|problem|point|answer|goal|risk|job|work|trick|secret|difference|challenge|bottleneck|reason|fix|lesson) (isn'?t|is not|was never|wasn'?t) [^.!?\\n]{1,80}[.;:,]\\s*(it'?s|it is|it was|the (real |actual |bigger |true )?(question|issue|problem|point|answer|goal|risk|job|work|trick|secret|difference|challenge|bottleneck|reason|fix|lesson) (is|was)|what matters)|(it'?s|it is|this is|that'?s|that is|this was|it was|they'?re|they are) (not|never) (just |only |simply |merely |really |about )?[^.!?\\n]{1,60}[.;:,]\\s*(it'?s|it is|it was|they'?re|they are|this was|that'?s)|(isn'?t|aren'?t|is not|are not|was never|wasn'?t|were never|weren'?t|is never) (a |an |the |about |really |just |only |simply |merely )?[^.!?\\n]{1,60}[.;:,]\\s*(it'?s|it is|it was|they'?re|they are|this was|that'?s|what matters is)|not (about|because of) [^.!?\\n]{1,40}[.;,:]\\s*(it'?s|it is) (about|because)|[a-z-]+ (was|is|were|are) never (the|a|an|about) [^.!?\\n]{1,40}[;:,]\\s*[^.!?\\n]{1,30} (was|is|were|are)\\.)"),
		hint: '"It\'s not X. It\'s Y." - two per post is the limit, a third fails' },
	{ id: 'self-posed-question', sev: 'count', scope: 'body',
		re: rx("(^|[.!?]\\s+|\\*\\*)(the|its|their|our|my|his|her|cost|result|price|verdict|outcome|catch) [^.!?\\n]{0,40}\\?\\s+[A-Z][^.!?\\n]{0,60}[.!]|(^|[.!?]\\s+)(and |so |but )?[A-Za-z][a-z']*( [a-z']+){0,2}\\?\\s+[A-Z][^.!?\\n]{0,50}[.!]|\\bwant to know (the|what|why|how)\\b[^?\\n]{0,30}\\?|\\b(but )?what does (that|this|it) (actually |really )?mean\\?|\\bwhy (does )?(that|this) matter\\?|\\bso what\\?|\\bsound familiar\\?|\\bthe (result|catch|kicker|problem|upshot|takeaway|answer|worst part|best part)\\?"),
		hint: '"The result? Devastating." self-posed drama question' },
	{ id: 'false-range', sev: 'warn', scope: 'body',
		re: rx('\\bfrom [a-z][^.!?\\n,]{2,30} to [a-z][^.!?\\n,]{2,30} to [a-z][^.!?\\n,]{2,30}\\b'),
		hint: '"from X to Y to Z" with no real scale between them - list them plainly' },
	{ id: 'superficial-ing-tail', sev: 'warn', scope: 'body',
		re: rx(',\\s(highlighting|underscoring|reflecting|showcasing|demonstrating|cementing|solidifying|reinforcing|signal(l)?ing|emphasi[sz]ing|illustrating|contributing to|paving the way|setting the stage|shaping how|marking a|pointing to|raising questions about|adding to|fuel(l)?ing)( (its|the|their|a|an|how|that|broader|why|what|just|for|of))?\\b'),
		hint: 'dangling "-ing" tail that pretends to analyse; cut it or make the claim a sourced sentence' },
	{ id: 'serves-as-dodge', sev: 'warn', scope: 'body',
		re: rx('\\b((serves?|served|serving) as|stands as|(functions?|acts?|operates?) as (a|an|the)|marks (a|the) (pivotal|turning|major|new|significant|first|beginning|start|end)|represents (a|the) (pivotal|turning|shift|major|significant|fundamental|single|biggest|largest|most))\\b'),
		hint: 'pompous copula; use "is"' },
	{ id: 'where-it-actually-lives', sev: 'warn', scope: 'body',
		re: rx('\\bwhere (the |your |their |its |real |actual )?[a-z-]+ (actually|really|truly) (lives|sits|happens|resides|hides)\\b|\\bwhere the (real|actual|true|hidden) [a-z-]+ (sits|lives|is|hides|happens)\\b|\\b(this|that) is where the [a-z-]+ (is|sits|lives)\\.'),
		hint: 'location metaphor standing in for a direct answer' },
	{ id: 'historical-analogy-run', sev: 'warn', scope: 'body',
		re: rx("\\b(every|each) (major|big|previous|prior) (technological |technology |tech |platform |industry )?(shift|wave|revolution|transition)\\b|\\b[A-Z][a-z]+ didn'?t (build|invent|create|make) [A-Z]|\\b(ask|remember|look at|think of|consider) (blockbuster|kodak|nokia|blackberry|myspace|yahoo|xerox|sears)\\b|\\b(blockbuster|kodak|nokia|blackberry|myspace)\\b[^.!?\\n]{0,40}\\b(blockbuster|kodak|nokia|blackberry|myspace)\\b"),
		hint: 'rapid-fire tech-history analogies borrow authority they have not earned' },

	// --- tone tells ---
	{ id: 'vague-attribution', sev: 'fail', scope: 'body', named: true,
		re: rx("\\b((seasoned |experienced |most |many |some |industry )?(studies|research|researchers|experts|analysts|observers|surveys|industry reports|industry benchmarks|the data|evidence|the numbers|the literature|practitioners|operators|veterans|pundits|commentators)|most (b2b )?(teams|marketers|companies|founders|people)|many (marketers|teams|companies|founders|people|organi[sz]ations)) (have |has )?(consistently |increasingly |generally |often |repeatedly |overwhelmingly |long )?(show|shows|shown|suggest|suggests|suggested|agree|agrees|agreed|argue|argues|argued|indicate|indicates|indicated|find|finds|found|say|says|said|recommend|recommends|confirm|confirms|confirmed|reveal|reveals|revealed|report|reports|reported|point to|estimate|estimates|believe|tell us|cite|cited|note|noted|warn|warned|recogni[sz]ed|backs? (this|that) up|is clear)\\b|\\b(it'?s|it is) (widely|generally|commonly) (known|accepted|understood|agreed|believed)\\b|\\baccording to (experts|research|studies|industry (data|reports|estimates)|some estimates|most (estimates|accounts))\\b|\\b(the consensus is|conventional wisdom (says|holds|is)|a growing body of (research|evidence)|one widely[- ]cited study|the data is clear|every (study|report|survey) i('?ve| have) (seen|read))\\b"),
		hint: 'name the source (linked, into the fact-check table) or make it a first-person claim; a brand, year, or link in the same sentence is treated as a named source' },
	{ id: 'appeal-to-familiarity', sev: 'warn', scope: 'body',
		re: rx("\\b(famously|notoriously|infamously|as (we|you) all know|as everyone knows|everyone knows (that )?|a classic (case|example|mistake)|(^|[.!?]\\s+)(of course|obviously|clearly),)(?![a-z])"),
		hint: 'consensus borrowed without evidence; show the evidence or drop the word' },
	{ id: 'its-no-secret', sev: 'fail', scope: 'all',
		re: rx("\\b(it'?s no secret|no secret that|we all know|everybody knows|as you probably know)\\b"),
		hint: 'banned filler opener' },
	{ id: 'false-vulnerability', sev: 'warn', scope: 'body',
		re: rx("\\b(and yes,|since we'?re being honest|full disclosure[:,]|i'?ll be honest[:,]|let'?s be honest[:,]|honestly,|to be honest[:,]|this (is|isn'?t) a (rant|takedown|hit piece|complaint|critique)|confession[:,]|i'?ll admit (it|that)?[:,]|i'?ll say the quiet part out loud|(^|[.!?]\\s+)cards on the table[:,]|i'?m aware (of )?(how|this|that) (this|that|it)? ?(sounds|reads)|i'?m (biased|not objective) here|i say this as someone who|i('?m| am) not going to pretend)(?![a-z])"),
		hint: 'performed candour; real vulnerability is a specific, uncomfortable detail' },
	{ id: 'grandiose-stakes', sev: 'warn', scope: 'all',
		re: rx("\\b(fundamentally (reshape|change|transform|alter|rewrite)|reshap(e|es|ing) how [a-z]+ (think|work|get|gets|are|is|will|plan|buy|sell)|everything (changes|is about to change|you know)|the future of [a-z ]{3,25} (depends|hinges) on|nothing (will ever be|short of|about this is incremental)|revolution(i[sz]e|i[sz]ed|i[sz]ing|ary)|transformative|seismic|tectonic|existential (threat|risk|question)|(changed|changes|will change) everything|will change how (every|all|each)|a new era of|sea change|inflection point|watershed|(won'?t|will not) look like a (faster|smarter|better) version of today|the ground is shifting|define the next decade|rewrit(e|es|ing) the rules|once-in-a-(generation|lifetime|decade)|the stakes (could not|couldn'?t) be higher)\\b"),
		hint: 'stakes inflation; a pricing page is not the fate of civilisation' },
	{ id: 'promotional-language', sev: 'warn', scope: 'all',
		re: rx('\\b(all-in-one|best-in-class|world-class|next-level|to the next level|effortless(ly)?|frictionless|unparalleled|unprecedented|supercharg(e|es|ed|ing)|turbocharg(e|es|ed|ing)|cutting-edge|state-of-the-art|bleeding-edge|purpose-built|for teams of (any|every|all) size|empower(s|ed|ing)?|elevat(e|es|ed|ing) (your|the|every)|unlock(s|ed|ing)? (the |your |their |new |hidden |real |true |full |faster |better |more |huge |massive |serious )?(potential|power|value|growth|insight|insights|revenue|opportunit|cycles|results|productivity|efficienc)|transform(s|ing)? (your|the way|how)|powerful, intuitive|holistic|game-?chang(er|ing)|seamless(ly)?)\\b'),
		hint: 'brochure copy; describe what it does with a number or a named example' },
	{ id: 'ai-vocabulary', sev: 'fail', scope: 'all',
		// "leverage" as a noun (pricing leverage, the leverage that ...) is exempt via the lookbehind; only the verb form fails
		re: rx('\\b(delv(e|es|ed|ing)|utili[sz](e|es|ed|ing)|leverag(es|ed|ing)|(?<!\\b(?:the|is|of|as|has|have|more|much|real|pricing|negotiating|no|little|some|any|their|our|its|your|that|this|with|for)\\s)leverage (your|the|this|these|their|our|its|a|an|ai|data|existing|what|every|each|any|all|it|them)|robust(ly|ness)?|streamlin(e|es|ed|ing)|harness(es|ed|ing)? (the|your|this|that|these|those|ai|data|every|all)|tapestry|paradigm( shift)?|synerg(y|ies|istic)|treasure trove|(a |is )testament to|in the realm of|navigat(e|es|ed|ing) the ([a-z]+ )?(landscape|complexities|world|waters|challenges)|ever-(evolving|changing|growing)|fast-paced|multifaceted|myriad|plethora|realm|embark(s|ed|ing)? on|foster(s|ed|ing)? (a |an )?(culture|environment|sense)|underscore(s|d)? the (importance|need|value)|crucial role|pivotal (role|moment)|vibrant|meticulous(ly)?|intricate|daunting|beacon|bustling|a deep(er)? understanding of|cannot be overstated|load-bearing)\\b'),
		hint: 'model vocabulary; use the plain word (use, build, strong, simplify, field, area)' },
	{ id: 'landscape-ecosystem', sev: 'warn', scope: 'all', skipFields: ['img_alt'],
		re: rx('\\b(?<!competitive )(marketing|seo|digital|business|tech|technology|ai|b2b|saas|search|media|content|current|changing|evolving|modern|broader|wider|overall|industry) (landscape|ecosystem)\\b|\\blandscape of\\b|\\b(the|this|that|our) ecosystem\\b'),
		hint: '"landscape"/"ecosystem" as a generic field-word; say market, category, stack, or the specific thing ("competitive landscape" as a term of art is exempt)' },
	{ id: 'magic-adverb', sev: 'count', scope: 'body',
		re: rx('\\b(quietly|silently|subtly|the quiet part|quiet (revolution|intelligence|power|force|shift|erosion|cost|crisis|killer|truth|tax|majority|failure|win)|deeply|profoundly|fundamentally|remarkably|arguably|unusually [a-z]+|genuinely|truly|incredibly|surprisingly|undeniably|inherently|invariably|certainly|materially|wildly|radically|strikingly|staggeringly|meaningfully|without fanfare|in a very real sense)\\b'),
		hint: 'significance-by-adverb; delete it or replace it with the specific' },
	{ id: 'collaborative-we-phrase', sev: 'warn', scope: 'body',
		re: rx("\\b(as we move forward|moving forward,|going forward,|we'?re now equipped|gives us a (much )?clearer picture|our focus (shifts|turns) to|we can (all )?agree|as we'?ve established|we'?ve (all )?been there)\\b"),
		hint: 'editorial "we" losing the first-person PMM voice; write "I" or name the team' },
	{ id: 'invented-concept-label', sev: 'warn', scope: 'body',
		re: rx("\\b(the )?[a-z]{3,}[ -](paradox|inversion|vacuum|treadmill|illusion|creep|trap|divide|spiral|overhang)\\b(?! (of|for) )|\\b(call (it|this|that)|i call (it|this)|what i call|let'?s call (it|this)) (the |a |an )?[a-z]+([ -][a-z]+)? ?(paradox|inversion|vacuum|treadmill|illusion|creep|trap|divide|spiral|overhang|gap|tax|debt|ceiling|penalty|dividend)\\b"),
		hint: 'coined "X paradox / X trap / X creep" label used as if established; make the argument, or attribute the term to whoever coined it (your own named framework is fine if you present it as yours)' },
	{ id: 'forced-simile', sev: 'warn', scope: 'body',
		re: rx("\\b(is|are|was|were|'s) (a bit |a little |kind of |sort of )?like (trying to|asking|using|running|building|driving|cooking|dating|playing|watching|having|hiring|selling|buying|owning|hiking|climbing|bringing|training|teaching) "),
		hint: 'reach for a simile only when it clarifies; delete it if the literal sentence works' },
];

/* ------------------------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------------------------- */
// capitalized tokens that are NOT sources (sentence openers, generic domain adjectives, acronyms)
const SOURCE_STOP = new Set(('B2B B2C SaaS SEO AI PMM GTM ABM CRM API ROI KPI CTA LLM LLMs AEO GEO PLG ICP US UK EU I A An The In But Yet And So Or Nor Some Most Many Few Several Here What When If This That These Those It Its As For On At Now Today Still Even While Because Since Our My Your Their One Two Three No Not Every All Any Each Other Another Good Bad New Old Big Small Large Long Short First Second Third Last Next Then There They We You He She Who Why How Where Which Whose Both Neither Either Unless Although Though Before After Once Until Whether Whatever However Meanwhile Instead Otherwise Also Again Only Just Perhaps Maybe Sometimes Often Usually Typically Generally Historically Traditionally Internally Externally Practically Realistically Technically Overall Indeed Actually Really Finally Obviously Clearly Naturally Ideally Unfortunately Fortunately Interestingly Importantly Notably Surprisingly Apparently Presumably Broadly Later Earlier Yes Okay OK Sure Fine Right Wrong True False Marketing Pricing Sales Product Industry Customer Modern Recent Current Growth Enterprise Startup Early Digital Content Search Email Social Paid Organic Brand Demand Revenue Account Buyer Competitive Positioning Messaging Launch Onboarding Lifecycle Performance Technical Local Mobile Ecommerce Agency Freelance Consumer Public Private Global Regional International Independent Anecdotal Academic Internal External Primary Secondary Quantitative Qualitative Historical Empirical Published Available Existing Prior Previous Multiple Numerous Various Countless Plenty Lots Seasoned Experienced Senior Junior Smart Good Great Real Actual Serious Honest Plain Simple Basic Common Popular Standard Classic Typical Average Median Total Overall Combined Aggregate Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December Q1 Q2 Q3 Q4 H1 H2 FY Series').split(' '));
const tokenIsSource = (t) => {
	const clean = t.replace(/^[("'\[]+|[,;:)"'\]?!.]+$/g, '');
	if (!clean) return false;
	if (/^(19|20)\d{2}$/.test(clean)) return true; // a year
	if (SOURCE_STOP.has(clean.replace(/'s$/, ''))) return false;
	if (/^[A-Z]/.test(clean)) return true; // Ahrefs, Gartner's, HubSpot, McKinsey
	return false;
};
function namedSourceBefore(before) {
	const seg = before.split(/[.!?]\s+/).pop() || '';
	return seg.trim().split(/\s+/).filter(Boolean).slice(-4).some(tokenIsSource);
}
function namedSourceAfter(after) {
	const seg = (after.split(/[.!?](\s|$)/)[0] || '').slice(0, 200);
	if (/\]/.test(seg)) return true; // a link follows in the same sentence
	if (/\b(19|20)\d{2}\b/.test(seg)) return true; // a dated report
	// a named source introduced by a preposition ("from Gartner", "by HubSpot", "in the 2025 State of PMM report"), or a brand-shaped token (HubSpot, GA4, McKinsey's)
	const m = seg.match(/\b(from|by|at|via|per|according to|in|of) (the )?([A-Z][A-Za-z0-9&.'-]*)/);
	if (m && tokenIsSource(m[3])) return true;
	return seg.split(/\s+/).filter(Boolean).slice(0, 25).some((t) => /^[A-Z][a-z]*[A-Z0-9]|'s$/.test(t.replace(/[,;:)"']+$/, '')) && tokenIsSource(t));
}
const FIRST_PERSON_BEFORE = /\b(?:my|our|i|i've|we've|the same)\s+$/i;
// "what the evidence says", "where the data says" - describing the post's contents, not attributing a claim
const META_BEFORE = /\b(what|where|whatever|how|when|whether)( do| does| did)?( the| your| our| their| this| that| these)?\s+$/i;
const REAL_COMPOUNDS = /^(the )?(sales|income|carbon|value|tech|technical|tax|import|export|scope|feature|price|pricing|discount|speed|context|complexity|cost|switching|success|luxury|estate|property|payroll|corporate|inheritance|capital|tourist|optical|bear|mouse|sand|honey|death|poverty|liquidity|debt|thirst|money|crawl|spider|bot|digital|urban|rural|gender|generational|wealth|doom|supply|inventory|redirect|spam|link)\s?-?(tax|creep|trap|illusion|divide|spiral|overhang)$/i;
const LABEL_PREFIX = /^(the )?(same|common|usual|classic|typical|biggest|real|obvious|first|second|next|other|another|this|that|each|every|only|worst|familiar|old|new|main|exact|opposite|hidden|silent|live|bigger|easy|perfect|potential|possible|likely|then|and|or|to|you|we|they|can|will|should|must|simply|just|not|never|always|also|still|even|either|neither|both|which|that|who|people|teams|numbers|revenue|budget|traffic|leads|deals)\s/i;

function splitFrontmatter(raw) {
	const lines = raw.split('\n');
	if (lines[0].trim() !== '---') return { fm: [], body: lines, offset: 0 };
	let end = -1;
	for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') { end = i; break; }
	if (end === -1) return { fm: [], body: lines, offset: 0 };
	return { fm: lines.slice(1, end), body: lines.slice(end + 1), offset: end + 1 };
}

function scrub(line) {
	// remove inline code, link/image targets, raw urls, html tags; keep link text (bracketed) so link membership can be tested
	return line
		.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length))
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, (m, alt) => alt + ' '.repeat(m.length - alt.length))
		.replace(/\]\([^)]*\)/g, (m) => ']' + ' '.repeat(m.length - 1))
		.replace(/https?:\/\/\S+/g, (m) => ' '.repeat(m.length))
		.replace(/<[^>]+>/g, (m) => ' '.repeat(m.length));
}
// blank out quoted material (sample prompts, vendor copy, scripted questions); keeps indices aligned
function stripQuoted(s) {
	return s
		.replace(/"[^"\n]{3,}"/g, (m) => ' '.repeat(m.length))
		.replace(/(^|[\s(])'(.{3,160}?)'(?=[\s.,;:)!?]|$)/g, (m, p) => p + ' '.repeat(m.length - p.length));
}

function isHeading(l) { return /^#{1,6}\s/.test(l); }
function isBullet(l) { return /^\s*([-*+]|\d+[.)])\s+/.test(l); }
function isTable(l) { return /^\s*\|/.test(l); }
function isQuote(l) { return /^\s*>/.test(l); }
function isBlank(l) { return l.trim() === ''; }
function isImage(l) { return /^\s*!\[/.test(l); }

function sentences(text) {
	return text
		.replace(/\s+/g, ' ')
		.trim()
		.split(/(?<=[.!?])\s+(?=["'(]?[A-Z0-9])/)
		.map((s) => s.trim())
		.filter(Boolean);
}
function words(text) { return text.trim().split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)); }

const SMALL_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'for', 'of', 'in', 'on', 'at', 'to', 'by', 'vs', 'with', 'from', 'into', 'as', 'is', 'are', 'that', 'than', 'your', 'you', 'it', 'its', 'when', 'how', 'why', 'what', 'not', 'if', 'per', 'up', 'out', 'over', 'do', 'does', 'be', 'so', 'no', 'yes', 'one', 'can', 'will', 'should']);
const LOWER_PROPER = /^(llms\.txt|robots\.txt|sitemap\.xml|iphone|ipad|ebay|macos|ios|npm|npx|astro|vercel|netlify|wordpress|hubspot|github|linkedin|chatgpt|x\.com|e-?commerce)$/i;
function headingWords(heading) {
	return heading.replace(/^#+\s*/, '').replace(/[*_`]/g, '').split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
}
function titleCaseWords(heading) {
	const ws = headingWords(heading);
	if (ws.length < 4) return false;
	const candidates = ws.slice(1).filter((w) => !SMALL_WORDS.has(w.toLowerCase().replace(/[^a-z]/g, '')) && !LOWER_PROPER.test(w));
	if (candidates.length < 3) return false;
	return candidates.every((w) => /^[A-Z(]/.test(w) || /^[A-Z0-9]+$/.test(w));
}
function sentenceCaseWords(heading) {
	const ws = headingWords(heading);
	if (ws.length < 4 || !/^[A-Z]/.test(ws[0])) return false;
	// at least one significant (non-small, non-proper) word is lowercase
	return ws.slice(1).some((w) => /^[a-z]/.test(w) && !SMALL_WORDS.has(w.toLowerCase().replace(/[^a-z]/g, '')) && !LOWER_PROPER.test(w));
}

const SLUG_STOP = new Set(['the', 'and', 'for', 'vs', 'with', 'your', 'how', 'what', 'why', 'when', 'where', 'who', 'which', 'you', 'are', 'can', 'does', 'should', 'from', 'into', 'that', 'this', 'is', 'of', 'in', 'on', 'to', 'do', 'use', 'get', 'make', 'new', 'good', 'best', 'top']);
const GENERIC_SLUG = new Set(['marketing', 'seo', 'strategy', 'strategies', 'guide', 'template', 'templates', 'examples', 'example', 'checklist', 'tools', 'tool', 'tips', 'saas', 'b2b', 'business', 'product', 'products', 'plan', 'planning', 'analysis', 'framework', 'management', 'manager', 'team', 'company', 'startup', 'startups', 'website', 'content', 'email', 'sales', 'growth', 'customer', 'customers', 'digital', 'search', 'online', 'free', 'ideas', 'questions', 'metrics', 'kpis', 'process', 'program', 'programs', 'campaign', 'campaigns']);
const EDITORIAL_WH = /^(what (is|are|'s) (actually|really) (going on|happening)|what to do (instead|next|differently|about (it|this))|how to (think|approach|handle|read this)|why (this|that|it) (matters|works|fails|happens)|when to (ignore|skip)|who(se)? (job|fault|problem)|what (this|that|it) (all )?(means|actually means|looks like)|where (this|that|it) (leaves|breaks|goes wrong)|what (i|we) (learned|changed|do differently|switched to)|what (actually|really) (happened|happens|works|matters)|what (we|i) do differently)\b/i;
const KEYWORD_WH = /^(how to|what is|what are|what to|when to|how (do|does|much|many|long|often)) (?!(actually|really|this|that|it|do|think|approach|handle|going|the (point|deal|catch)|ignore|skip|next|instead)\b)[a-z0-9]|^why (?!(this|that|it) )[a-z0-9 ,'"()-]+ (matter|matters|fail|fails|work|works)\b/i;

/* ------------------------------------------------------------------------------------------
 * Lint one file
 * ---------------------------------------------------------------------------------------- */
function lintFile(file) {
	const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
	const { fm, body, offset } = splitFrontmatter(raw);
	const hits = []; // {sev, id, line, snippet, hint, count?}
	const add = (sev, id, line, snippet, hint, count) => hits.push({ sev, id, line, snippet: String(snippet).trim().slice(0, 140), hint, ...(count !== undefined ? { count } : {}) });
	const lineNo = (i) => offset + i + 1;

	// --- frontmatter: title, description, alt text, faq ANSWERS (questions are real queries, not scanned) ---
	fm.forEach((l, i) => {
		const m = l.match(/^\s*(?:-\s*)?(title|description|img_alt|a|name|text):\s*(.*)$/);
		if (!m) return;
		const text = stripQuoted(scrub(m[2]).replace(/^["']|["']$/g, ' '));
		for (const r of LINE_RULES) {
			if (r.scope !== 'all') continue;
			if (r.skipFields && r.skipFields.includes(m[1])) continue;
			const mm = (r.raw ? scrub(m[2]) : text).match(r.re);
			if (mm) add(r.sev === 'count' ? 'warn' : r.sev, r.id, i + 2, `[frontmatter ${m[1]}] ${mm[0]}`, r.hint);
		}
	});

	// --- body pre-pass: code fences (matched markers), html comments, quoted spans; scrubbed lines ---
	let fence = null; // { char, len, line }
	let inComment = false;
	let quoteOpen = false;
	const scannedRaw = []; // scrubbed, quotes intact (unicode rule)
	const scanned = []; // scrubbed + quoted material blanked; null = not prose (code / comment)
	body.forEach((l, i) => {
		const fm2 = l.match(/^\s*(`{3,}|~{3,})/);
		if (fm2) {
			if (!fence) { fence = { char: fm2[1][0], len: fm2[1].length, line: i }; scannedRaw.push(null); scanned.push(null); return; }
			if (fm2[1][0] === fence.char && fm2[1].length >= fence.len) { fence = null; scannedRaw.push(null); scanned.push(null); return; }
		}
		if (fence) { scannedRaw.push(null); scanned.push(null); return; }
		let text = l;
		if (inComment) {
			const end = text.indexOf('-->');
			if (end === -1) { scannedRaw.push(null); scanned.push(null); return; }
			text = ' '.repeat(end + 3) + text.slice(end + 3);
			inComment = false;
		}
		const cs = text.indexOf('<!--');
		if (cs !== -1 && text.indexOf('-->', cs) === -1) { text = text.slice(0, cs); inComment = true; }
		const s = scrub(text);
		scannedRaw.push(s);
		// multi-line quoted block (a sample prompt spanning lines): parity carries across non-blank lines
		let q = s;
		if (isBlank(l)) quoteOpen = false;
		else {
			if (quoteOpen) {
				const close = q.indexOf('"');
				if (close === -1) { scanned.push(' '.repeat(q.length)); return; }
				q = ' '.repeat(close + 1) + q.slice(close + 1);
				quoteOpen = false;
			}
			q = stripQuoted(q);
			const remaining = (q.match(/"/g) || []).length;
			if (remaining % 2 === 1) { const last = q.lastIndexOf('"'); q = q.slice(0, last) + ' '.repeat(q.length - last); quoteOpen = true; }
		}
		scanned.push(q);
	});
	if (fence) add('fail', 'unclosed-fence', lineNo(fence.line), body[fence.line], 'code fence never closed - everything after it was skipped; close it or the gate is meaningless');

	// --- line-level rules over body ---
	const counts = {};
	scanned.forEach((s, i) => {
		if (s === null) return;
		if (s.trim() === '') return; // markup-only or fully quoted line
		const img = isImage(body[i]);
		for (const r of LINE_RULES) {
			if (img && !r.raw) continue; // image alt text: unicode only
			const text = r.raw ? scannedRaw[i] : s;
			const re = new RegExp(r.re.source, r.re.flags.includes('g') ? r.re.flags : r.re.flags + 'g');
			let m;
			while ((m = re.exec(text)) !== null) {
				if (m[0].length === 0) { re.lastIndex++; continue; }
				const before = text.slice(0, m.index);
				const after = text.slice(m.index + m[0].length);
				if (r.named) {
					// "[Research shows](url)" - the phrase IS the link to the source
					const lb = text.lastIndexOf('[', m.index);
					const rb = text.indexOf(']', m.index + m[0].length);
					if (lb !== -1 && rb !== -1 && text.indexOf(']', lb) === rb) continue;
					if (namedSourceBefore(before) || namedSourceAfter(after) || FIRST_PERSON_BEFORE.test(before) || META_BEFORE.test(before)) continue;
				}
				if ((r.id === 'compulsive-counting' || r.id === 'self-posed-question') && isHeading(body[i])) continue;
				if (r.id === 'ai-vocabulary' && /testament/.test(m[0]) && /\bnot (a )?testament/i.test(text)) continue;
				if (r.id === 'invented-concept-label') {
					const rest = after.slice(0, 20);
					if (REAL_COMPOUNDS.test(m[0]) || LABEL_PREFIX.test(m[0]) || /^(the )?(tax|trap|creep|illusion|paradox|vacuum|treadmill|inversion|divide|spiral|overhang)$/i.test(m[0])) continue;
					if (/^[ -]?(objections?|questions?|setting|drill|door|card)\b/i.test(rest)) continue; // trap question, trap objection
				}
				if (r.sev === 'count') { (counts[r.id] = counts[r.id] || []).push({ line: lineNo(i), snippet: m[0] }); continue; }
				add(r.sev, r.id, lineNo(i), m[0], r.hint);
				if (r.id === 'unicode-decoration' || r.id === 'ascii-em-dash') break; // one per line is enough
			}
		}
	});

	// --- headings ---
	const slugWords = path.basename(file).replace(/\.mdx?$/i, '').split('-').filter((w) => w.length > 2 && !SLUG_STOP.has(w));
	const headings = body.map((l, i) => ({ l, i })).filter(({ l, i }) => scanned[i] !== null && isHeading(l) && !/^#\s/.test(l));
	let whHeaders = 0;
	let titleCase = 0;
	let sentenceCase = 0;
	for (const { l, i } of headings) {
		const text = l.replace(/^#+\s*/, '').trim();
		const lower = text.toLowerCase();
		const wh = /^(what|why|where|when|who|whose|which)\b/i.test(text);
		const question = /\?\s*$/.test(text);
		// keyword-bearing headings carry search intent and are allowed: the post's own slug words, or a "what is X / how to X" shape with a content noun
		const matched = slugWords.filter((w) => lower.includes(w.length > 4 ? w.slice(0, -1) : w));
		// two slug words, or one distinctive slug word (a named side of a "X vs Y" post: "Where ABM wins") - generic words alone do not count
		const keywordBearing = slugWords.length ? (matched.length >= Math.min(2, slugWords.length) || matched.some((w) => !GENERIC_SLUG.has(w))) : false;
		const editorial = EDITORIAL_WH.test(text);
		if (wh && !question && (editorial || (!keywordBearing && !KEYWORD_WH.test(text)))) {
			whHeaders++;
			add('warn', 'wh-header', lineNo(i), text, 'editorial Wh-heading ("What we do differently"); name the section by its content, or make it a real question with the answer beneath');
		}
		if (titleCaseWords(l)) titleCase++;
		else if (sentenceCaseWords(l)) sentenceCase++;
	}
	if (whHeaders >= 4) add('fail', 'wh-header-density', 0, `${whHeaders} non-question Wh-headings`, 'four or more editorial Wh-headings is a structural tell', whHeaders);
	// Title Case H2s are the established site convention; the defect worth flagging is mixing cases inside one post
	if (titleCase >= 2 && sentenceCase >= 2) add('warn', 'mixed-heading-case', 0, `${titleCase} Title Case vs ${sentenceCase} sentence case H2/H3`, 'pick one heading case per post (site convention is Title Case for H2/H3)', Math.min(titleCase, sentenceCase));

	// --- bullet blocks: bold-first (fading trope; flag the post only when the pattern repeats) ---
	let block = [];
	const boldBlocks = [];
	const flushBlock = () => {
		if (block.length >= 5) {
			const bold = block.filter(({ l }) => /^\s*([-*+]|\d+[.)])\s+\*\*/.test(l)).length;
			if (bold === block.length) boldBlocks.push(lineNo(block[0].i));
		}
		block = [];
	};
	body.forEach((l, i) => {
		if (scanned[i] !== null && isBullet(l)) block.push({ l, i });
		else if (!isBlank(l) || block.length === 0) flushBlock();
	});
	flushBlock();
	if (boldBlocks.length >= 2) add('warn', 'bold-first-bullets', boldBlocks[0], `${boldBlocks.length} lists of 5+ where every bullet opens bold (lines ${boldBlocks.join(', ')})`, 'one bold-label list per post is fine; vary the others (plain bullets, a table, or prose)', boldBlocks.length);

	// --- paragraphs ---
	const paras = [];
	let cur = null;
	let prevNonBlank = -1;
	body.forEach((l, i) => {
		const s = scanned[i];
		const structural = s === null || isHeading(l) || isBullet(l) || isTable(l) || isQuote(l) || isImage(l) || isBlank(l) || s.trim() === '';
		if (structural) { if (cur) { paras.push(cur); cur = null; } if (!isBlank(l)) prevNonBlank = i; return; }
		if (!cur) cur = { start: i, lines: [], afterImage: prevNonBlank >= 0 && isImage(body[prevNonBlank]) };
		cur.lines.push(s);
		prevNonBlank = i;
	});
	if (cur) paras.push(cur);

	let staccatoRuns = 0;
	let enumParas = 0;
	let ordinalParas = 0;
	let enumSentenceRuns = 0;
	let bodyWords = 0;
	let fragmentHits = [];
	const staccatoHits = [];
	const enumRe = /^(the|a|another|one more) (first|second|third|fourth|fifth|sixth|final|last) (wall|takeaway|reason|problem|point|lesson|issue|step|mistake|factor|rule|thing|pattern|signal|question|principle|trap|lever|mode|option|failure|approach|test)\b/i;
	const ordinalRe = /^(first|second|third|fourth|fifth|sixth|finally|lastly),/i;
	const enumSentenceRe = /^(the (first|second|third|fourth|fifth) (is|was|one)|(rule|step|lesson|reason|mistake|wall) (one|two|three|four|five|\d)\b)/i;
	// question and conditional openers are structured lists in prose, not the trope ("Does X? Does Y?", "If it clears 70 ... If it lands under 40 ...")
	const ANAPHORA_STOP = new Set(['the', 'a', 'an', 'this', 'that', 'these', 'those', 'it', 'i', 'in', 'on', 'at', 'for', 'but', 'and', 'so', 'if', 'as', 'to', 'my', 'our', 'your', 'his', 'her', 'its', 'one', 'there', 'here', 'he', 'she', 'of', 'by', 'with', 'from', 'does', 'do', 'is', 'are', 'can', 'will', 'should', 'when', 'where', 'how', 'what', 'why', 'who', 'which']);
	for (const p of paras) {
		const text = p.lines.join(' ');
		const ws = words(text);
		bodyWords += ws.length;
		const ss = sentences(text);
		const trimmed = text.trim();
		// standalone fragment paragraph (<=5 words, one sentence, ends with . or !)
		if (ss.length === 1 && ws.length <= 5 && /[.!]$/.test(trimmed) && !/^(\*\*|_|\*)/.test(trimmed)) {
			fragmentHits.push({ line: lineNo(p.start), snippet: trimmed });
		}
		// bold/italic standalone aphorism: one sentence, ends with a terminator (labels end ":", questions "?"), 5-16 words, no digits, not an image caption
		if (ss.length === 1 && /^(\*\*|_|\*)[^*_]+[.!](\*\*|_|\*)$/.test(trimmed) && ws.length >= 5 && ws.length <= 16 && !/\d/.test(trimmed) && !p.afterImage) {
			add('warn', 'quotable-one-liner', lineNo(p.start), trimmed, 'slide-bait aphorism check: does this line carry a fact a reader can act on, or only sound quotable?');
		}
		// staccato run: 3+ consecutive sentences of <=4 words (bold-numbered prompt/label paragraphs are skipped)
		let run = 0;
		for (let k = 0; k < ss.length && !/^\*\*/.test(trimmed); k++) {
			if (words(ss[k]).length <= 4) {
				run++;
				if (run === 3) { staccatoRuns++; staccatoHits.push({ line: lineNo(p.start), snippet: ss.slice(k - 2, k + 1).join(' ') }); }
			} else run = 0;
		}
		// in-paragraph fragments: "... on a Friday. Openly. On purpose." - 1-2 word sentences after the first count as fragments
		if (!/^\*\*/.test(trimmed)) for (let k = 1; k < ss.length; k++) if (words(ss[k]).length <= 2 && /[.!]$/.test(ss[k])) fragmentHits.push({ line: lineNo(p.start), snippet: ss[k] });
		// anaphora: 3+ consecutive sentences opening with the same two words, or the same non-trivial first word
		if (ss.length >= 3) {
			let same2 = 1;
			let same1 = 1;
			for (let k = 1; k < ss.length; k++) {
				const wa = words(ss[k - 1]).map((w) => w.toLowerCase().replace(/[^a-z']/g, ''));
				const wb = words(ss[k]).map((w) => w.toLowerCase().replace(/[^a-z']/g, ''));
				const a = wa.slice(0, 2).join(' ');
				const b = wb.slice(0, 2).join(' ');
				if (a && a === b && !ANAPHORA_STOP.has(wa[0])) same2++; else same2 = 1;
				if (wa[0] && wa[0] === wb[0] && !ANAPHORA_STOP.has(wa[0])) same1++; else same1 = 1;
				if (same2 === 3 || same1 === 3) {
					add('warn', 'anaphora', lineNo(p.start), ss.slice(k - 2, k + 1).map((x) => x.slice(0, 40)).join(' | '), 'three sentences opening with the same words; vary the openers');
					same2 = 0; same1 = 0;
				}
			}
			// enumerated sentences: "The first is X. The second is Y. The third is Z."
			const enumCount = ss.filter((x) => enumSentenceRe.test(x)).length;
			if (enumCount >= 3) enumSentenceRuns++;
		}
		if (enumRe.test(trimmed)) enumParas++;
		if (ordinalRe.test(trimmed)) ordinalParas++;
	}
	if (enumParas >= 2 || ordinalParas >= 3 || enumSentenceRuns >= 1) add('warn', 'enumerated-prose', 0, `${enumParas} paragraphs open "The first / The second ...", ${ordinalParas} open "First, / Second, ...", ${enumSentenceRuns} paragraphs enumerate "The first is / The second is"`, 'listicle disguised as prose; use a real list or write connected paragraphs', enumParas + ordinalParas + enumSentenceRuns);
	// strictly.fyi carve-out: the house sign-off "Strictly FYI." closes every entry and is not manufactured emphasis.
	fragmentHits = fragmentHits.filter((x) => x.snippet.trim() !== 'Strictly FYI.');
	if (fragmentHits.length >= 3) add('fail', 'fragment-density', 0, `${fragmentHits.length} standalone fragment paragraphs (lines ${fragmentHits.map((x) => x.line).join(', ')})`, 'manufactured emphasis; fold fragments into full sentences (max 2 per post)', fragmentHits.length);
	else fragmentHits.forEach((x) => add('warn', 'fragment-paragraph', x.line, x.snippet, 'standalone fragment for emphasis; two is the limit per post'));
	if (staccatoRuns >= 2) add('fail', 'staccato-density', 0, `${staccatoRuns} runs of 3+ clipped sentences (lines ${staccatoHits.map((x) => x.line).join(', ')})`, 'one clipped run reads as rhythm, two reads as a model (max 1 per post)', staccatoRuns);
	else staccatoHits.forEach((x) => add('warn', 'staccato-run', x.line, x.snippet, 'three or more clipped sentences in a row; one such run is the limit'));
	if (bodyWords < 50) add('fail', 'empty-body', 0, `${bodyWords} body words`, 'no body text found - wrong path, unwritten draft, or the post is not prose; a gate on nothing is not a pass', bodyWords);

	// --- counted tropes -> thresholds ---
	const np = counts['negative-parallelism'] || [];
	if (np.length >= 3) add('fail', 'negative-parallelism', 0, `${np.length} occurrences (lines ${np.map((x) => x.line).join(', ')})`, '"It\'s not X. It\'s Y." three or more times; two is the limit, rewrite the rest as plain claims', np.length);
	else np.forEach((x) => add('warn', 'negative-parallelism', x.line, x.snippet, 'two per post is the limit; a third fails'));
	const sq = counts['self-posed-question'] || [];
	if (sq.length >= 2) add('fail', 'self-posed-question', 0, `${sq.length} occurrences (lines ${sq.map((x) => x.line).join(', ')})`, '"The result? X." drama question more than once; state the point', sq.length);
	else sq.forEach((x) => add('warn', 'self-posed-question', x.line, x.snippet, 'one rhetorical self-question is the limit'));
	const ma = counts['magic-adverb'] || [];
	const per1k = bodyWords ? (ma.length / bodyWords) * 1000 : 0;
	if (ma.length && per1k > 3) add('fail', 'magic-adverb-density', 0, `${ma.length} in ${bodyWords} words (${per1k.toFixed(1)}/1k; lines ${ma.map((x) => x.line).join(', ')})`, 'more than 3 significance-adverbs per 1,000 words; delete most of them', ma.length);
	else ma.forEach((x) => add('warn', 'magic-adverb', x.line, x.snippet, 'delete the adverb or replace it with the specific'));
	// editorial "we" density (first-person "I" voice is the site convention); scripted bold questions are excluded
	const weCount = paras.reduce((n, p) => n + (/\?\*\*\s*$/.test(p.lines.join(' ').trim()) ? 0 : (p.lines.join(' ').match(/\b(we|we're|we've|we'll|our|ours|us)\b/gi) || []).length), 0);
	const wePer1k = bodyWords ? (weCount / bodyWords) * 1000 : 0;
	if (bodyWords > 300 && wePer1k > 12) add('warn', 'collaborative-we-density', 0, `${weCount} we/our/us in ${bodyWords} words (${wePer1k.toFixed(1)}/1k)`, 'editorial "we" drowning the first-person voice; check each "we" is a named team, not a generic collective', weCount);

	const fails = hits.filter((h) => h.sev === 'fail');
	const warns = hits.filter((h) => h.sev === 'warn');
	return { file, words: bodyWords, fails, warns, score: fails.length * 3 + warns.length, hits };
}

/* ------------------------------------------------------------------------------------------
 * Run
 * ---------------------------------------------------------------------------------------- */
const results = [];
for (const f of files) {
	try { results.push(lintFile(f)); }
	catch (e) { usage(`error reading ${f}: ${e.message}`); }
}
if (baseline) {
	for (const r of results) {
		const base = path.basename(r.file);
		for (const h of r.hits) {
			h.preexisting = h.line === 0
				? (baseline.postHits.has(`${base}|${h.id}`) && (h.count || 1) <= baseline.postHits.get(`${base}|${h.id}`))
				: baseline.lineHits.has(`${base}|${h.id}|${h.snippet}`);
		}
		r.newFails = r.fails.filter((h) => !h.preexisting).length;
		r.newWarns = r.warns.filter((h) => !h.preexisting).length;
	}
}
const strict = flags.has('--strict');
const anyFail = baseline
	? results.some((r) => r.newFails > 0 || (strict && r.newWarns > 0))
	: results.some((r) => r.fails.length > 0 || (strict && r.warns.length > 0));

if (flags.has('--json')) {
	console.log(JSON.stringify({ gate: anyFail ? 'FAIL' : 'PASS', results }, null, 2));
	process.exit(anyFail ? 1 : 0);
}

const quiet = flags.has('--quiet') || flags.has('--all');
for (const r of results.sort((a, b) => b.score - a.score)) {
	const delta = baseline ? ` (${r.newFails} NEW FAIL, ${r.newWarns} NEW WARN vs baseline)` : '';
	console.log(`${path.basename(r.file)}: ${r.fails.length} FAIL, ${r.warns.length} WARN, ${r.words} words, score ${r.score}${delta}`);
	if (quiet) continue;
	const ordered = r.hits.slice().sort((a, b) => (a.sev === b.sev ? a.line - b.line : a.sev === 'fail' ? -1 : 1));
	for (const h of ordered) {
		const tag = baseline ? (h.preexisting ? ' (pre-existing)' : ' (NEW)') : '';
		console.log(`  ${h.sev.toUpperCase().padEnd(4)} ${h.line ? 'L' + h.line : 'post'}  [${h.id}]${tag} "${h.snippet}"`);
		console.log(`       -> ${h.hint}`);
	}
}
if (flags.has('--all')) {
	const totalFail = results.reduce((n, r) => n + r.fails.length, 0);
	const totalWarn = results.reduce((n, r) => n + r.warns.length, 0);
	console.log(`\n${results.length} posts: ${results.filter((r) => r.fails.length).length} with FAIL hits, ${totalFail} FAIL total, ${totalWarn} WARN total`);
}
console.log(`TROPE GATE: ${anyFail ? 'FAIL' : 'PASS'}`);
process.exit(anyFail ? 1 : 0);
