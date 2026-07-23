#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), 'messages')
const ko = JSON.parse(fs.readFileSync(path.join(root, 'ko.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.join(root, 'en.json'), 'utf8'))

const flatten = (obj, prefix = '') => {
  /** @type {string[]} */
  const keys = []
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flatten(value, next))
    } else {
      keys.push(next)
    }
  }
  return keys
}

const koKeys = new Set(flatten(ko))
const enKeys = new Set(flatten(en))

const missingInEn = [...koKeys].filter((k) => !enKeys.has(k))
const missingInKo = [...enKeys].filter((k) => !koKeys.has(k))

if (missingInEn.length || missingInKo.length) {
  console.error('Message key parity failed:')
  if (missingInEn.length) console.error('  missing in en:', missingInEn)
  if (missingInKo.length) console.error('  missing in ko:', missingInKo)
  process.exit(1)
}

console.log(`OK — ${koKeys.size} keys match in ko/en`)
