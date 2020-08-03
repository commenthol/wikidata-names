const family = require('./data/family-lang.json')
const female = require('./data/female-lang.json')
const male = require('./data/male-lang.json')
const unisex = require('./data/unisex-lang.json')

const JOIN = '__'

const byLanguage = (names, { filter, join } = {}) => {
  const filterfn = !filter
    ? () => true
    : filter instanceof RegExp
      ? (lang) => filter.test(lang)
      : (lang) => filter.includes(lang)

  const joined = (obj) => join ? [...new Set(obj[JOIN])].sort() : obj

  return joined(Object.entries(names).reduce((o, [name, langs]) => {
    langs.filter(filterfn).forEach(lang => {
      const _lang = join ? JOIN : lang
      if (!o[_lang]) o[_lang] = []
      o[_lang].push(name)
    })
    return o
  }, {}))
}

module.exports = {
  byLanguage,
  family,
  female,
  male,
  unisex
}
