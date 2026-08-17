'use strict'

// ASCII punctuation except space. Shifted number-row punctuation is included.
const ASCII_PUNCTUATION = /^[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]$/

function shouldDeferKeydown (event, isMacOS) {
    return Boolean(
        isMacOS &&
        event &&
        event.type === 'keydown' &&
        !event.defaultPrevented &&
        !event.isComposing &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        typeof event.key === 'string' &&
        ASCII_PUNCTUATION.test(event.key)
    )
}

module.exports = {
    shouldDeferKeydown,
}
