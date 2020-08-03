# wikidata-names

> First names and family names

Data is queried from [Wikidata][].

Credits go to [wikidata-person-names](https://www.npmjs.com/package/wikidata-person-names) for the SPARKQL queries.

## Usage

plain names as array...

```js
const {
  female,
  family,
  male,
  unisex
} = require('wikidata-names')

console.log(female)
// => [" 法蕾莉-安妮","A'Lee","A'isha","A-ra","A-rum",...]
console.log(male)
// => [" 於爾基","A-Jay","Aad","Aadolf","Aadu",...]
```

names with language info

```js
const {
  female,
  family,
  male,
  unisex,
  byLanguage
} = require('wikidata-names/lang')

console.log(female)
// => {" 法蕾莉-安妮":["zh-hant","zh-tw"],"A'Lee":["ast","en","sq"],... }
console.log(male)
// => {" 於爾基":["zh-hant","zh-tw"],"A-Jay":["en","sq"],"Aad":["af","an",...,"tr"],...}
```

`wikidata-names/lang` comes with a helper function `byLanguage` to group, filter and join names by language.

```js
const {
  female,
  byLanguage
} = require('wikidata-names/lang')

// group names by language
const names = byLanguage(female)
//> Object.keys(names) === [ 'aa', 'ab', 'ace', ..., 'zh-sg', 'zh-tw' ]
//> names.aa = [ 'Aafje', 'Aagot', 'Aaliyah', 'Aamina', 'Aanchal', 'Aasa', ... ]

// group and filter for 'en' and 'fr'
const names = byLanguage(female, { filter: ['en', 'fr'] })
//> names.en = [ "A'Lee", "A'isha", 'A-ra', ... ]
//> names.fr = [ "A'isha", 'Aadya', 'Aaf', ... ]

// filter by regex
const names = byLanguage(female, { filter: /^en/ })
//> Object.keys(names) === [ 'en', 'en-ca', 'en-gb' ]

// filter and join all names; returns an array, not object!
const names = byLanguage(female, { filter: /^en/, join: true })
//> names = [ "A'Lee", "A'isha", 'A-ra', 'Aabha', ... ]
```

## Note

The family names dataset is incomplete compared to all data available on wikidata.
The long running query may have been prematurely aborted.

## License

Code is licensed under [Unlicense](https://unlicense.org/).

Data is from [Wikidata][] and licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

[Wikidata]: https://www.wikidata.org
