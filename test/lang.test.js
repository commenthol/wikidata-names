const assert = require('assert')
const { byLanguage, female } = require('../lang.js')

const log = process.env.LOG ? console.log : () => {}

describe('lang', function () {
  describe('byLanguage', function () {
    it('shall group by language', function () {
      const names = byLanguage(female)
      assert.strictEqual(Object.keys(names).length, 413)
      Object.keys(names).forEach(lang => {
        assert.ok(Array.isArray(names[lang]))
      })
      const keys = Object.keys(names).sort()
      log(keys.slice(0, 5))
      log(keys.slice(keys.length-6 , keys.length-1))
      log(names.aa.slice(0, 6))
    })

    it('shall group and filter by language', function () {
      const names = byLanguage(female, { filter: ['en', 'fr'] })
      assert.strictEqual(Object.keys(names).length, 2)
      log(names.en.slice(0, 6))
      log(names.fr.slice(0, 6))
    })

    it('shall group and filter by language with regex', function () {
      const names = byLanguage(female, { filter: /^en/ })
      assert.deepStrictEqual(Object.keys(names).sort(), ['en', 'en-ca', 'en-gb'])
    })

    it('shall filter and join by language with regex', function () {
      const names = byLanguage(female, { filter: /^en/, join: true })
      assert.ok(Array.isArray(names))
      log(names.slice(0, 6))
    })
  })
})
