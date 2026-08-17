'use strict'

const { Injectable, NgModule } = require('@angular/core')
const { TerminalDecorator } = require('tabby-terminal')
const { shouldDeferKeydown } = require('./logic')

function isMacOS () {
    if (typeof process !== 'undefined' && process.platform) {
        return process.platform === 'darwin'
    }
    return typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
}

class SogouPunctuationDecorator extends TerminalDecorator {
    constructor () {
        super()
        this.registrations = new WeakMap()
    }

    attach (tab) {
        if (!isMacOS()) {
            return
        }

        // Duck-type the xterm frontend to avoid coupling this plugin to a
        // particular Tabby/XTermFrontend package instance.
        const element = tab && tab.frontend && tab.frontend.xterm && tab.frontend.xterm.element
        if (!element) {
            return
        }

        const listener = event => {
            if (!shouldDeferKeydown(event, true)) {
                return
            }

            // Keep this keydown away from xterm.js, which would otherwise
            // emit event.key immediately and call preventDefault(). Do not
            // prevent the default: Sogou needs the native keypress/input
            // sequence to turn the ASCII key into Chinese punctuation.
            event.stopPropagation()
        }

        element.addEventListener('keydown', listener, true)
        this.registrations.set(tab, { element, listener })
        console.debug('[tabby-sogou-punctuation-fix] attached')
    }

    detach (tab) {
        const registration = this.registrations.get(tab)
        if (registration) {
            registration.element.removeEventListener('keydown', registration.listener, true)
            this.registrations.delete(tab)
        }
        super.detach(tab)
    }
}

Injectable()(SogouPunctuationDecorator)

class SogouPunctuationFixModule {}

NgModule({
    providers: [
        {
            provide: TerminalDecorator,
            useClass: SogouPunctuationDecorator,
            multi: true,
        },
    ],
})(SogouPunctuationFixModule)

exports.SogouPunctuationDecorator = SogouPunctuationDecorator
exports.default = SogouPunctuationFixModule
