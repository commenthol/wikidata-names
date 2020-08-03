const stream = require('stream')
const { resolve } = require('path')
const { promisify } = require('util');
const fsP = require('fs').promises

const wdk = require('wikidata-sdk')
const got = require('got');
const through = require('through2')
const JSONStream = require('JSONStream')

const pipeline = promisify(stream.pipeline);

const DATADIR = resolve(__dirname, '../data')

const SOURCE_ENTITY_ID = {
	UNISEX: 'Q3409032',
	FEMALE: 'Q11879590',
	MALE: 'Q12308941',
	FAMILY: 'Q101352'
}

function buildQuery(category) {
	return `SELECT ?label WHERE {
  ?item wdt:P31 wd:${category}.
  ?item rdfs:label ?label.
}`
}

async function streamQuery (category) {
	console.time(`streamQuery ${category}`)

	const query = buildQuery(category)
	const url = wdk.sparqlQuery(query)

	const map = {}

	try {
		await pipeline(
			got.stream(url),
			JSONStream.parse('results.bindings.*.label'),
			through.obj(function (data, enc, cb) {
				const { ['xml:lang']: lang, value } = data
				if (!map[value]) map[value] = new Set()
				map[value].add(lang)
				cb()
			})
		)
	} catch (e) {
		// long running queries may timeout
		// then our result set may not be complete
		console.error(e.message)
	}

	console.timeEnd(`streamQuery ${category}`)
	return Object.keys(map).sort().reduce((o, key) => {
		o[key] = Array.from(map[key]).sort()
		return o
	}, {})
}

async function saveData (key, results) {
	const klc = key.toLowerCase()
	const filename = resolve(DATADIR, `${klc}.json`)
	const filenameLang = resolve(DATADIR, `${klc}-lang.json`)
	await fsP.writeFile(filename, JSON.stringify(Object.keys(results)), 'utf8')
	await fsP.writeFile(filenameLang, JSON.stringify(results), 'utf8')
}

async function run() {
	for (const key in SOURCE_ENTITY_ID) {
		const category = SOURCE_ENTITY_ID[key]
		console.log(key, category)
		const results = await streamQuery(category)
		await saveData(key, results)
	}
}

run();
