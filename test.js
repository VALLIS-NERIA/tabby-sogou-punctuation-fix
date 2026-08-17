'use strict'

const assert = require('node:assert/strict')
const { shouldDeferKeydown } = require('./dist/logic')

const keydown = overrides => ({
    type: 'keydown',
    key: '.',
    defaultPrevented: false,
    isComposing: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
})

assert.equal(shouldDeferKeydown(keydown(), true), true)
assert.equal(shouldDeferKeydown(keydown({ key: '!' }), true), true)
assert.equal(shouldDeferKeydown(keydown({ key: '^' }), true), true)
assert.equal(shouldDeferKeydown(keydown({ key: '?', shiftKey: true }), true), true)
assert.equal(shouldDeferKeydown(keydown({ key: 'a' }), true), false)
assert.equal(shouldDeferKeydown(keydown({ key: '1' }), true), false)
assert.equal(shouldDeferKeydown(keydown({ key: '。' }), true), false)
assert.equal(shouldDeferKeydown(keydown({ ctrlKey: true }), true), false)
assert.equal(shouldDeferKeydown(keydown({ altKey: true }), true), false)
assert.equal(shouldDeferKeydown(keydown({ metaKey: true }), true), false)
assert.equal(shouldDeferKeydown(keydown({ isComposing: true }), true), false)
assert.equal(shouldDeferKeydown(keydown({ defaultPrevented: true }), true), false)
assert.equal(shouldDeferKeydown(keydown({ type: 'keyup' }), true), false)
assert.equal(shouldDeferKeydown(keydown(), false), false)

console.log('tabby-sogou-punctuation-fix tests passed')
