# Tabby Sogou Punctuation Fix

A small [Tabby](https://tabby.sh/) plugin that fixes Chinese punctuation when
using Sogou Input Method on macOS. Without the plugin, punctuation such as `。`
and `，` may arrive in the terminal as `.` and `,`.

## Install

Once the package is indexed by npm:

1. Open **Tabby → Settings → Plugins**.
2. Search for **Sogou punctuation fix**.
3. Install the plugin and restart Tabby completely.

The package can also be installed into Tabby's plugin directory with npm:

```bash
npm install tabby-sogou-punctuation-fix
```

## How it works

With Sogou on macOS, the physical punctuation key can initially produce an
ASCII `keydown` such as `.`. Sogou publishes the final Chinese punctuation
later through `keypress`/`input`. xterm.js consumes the early `keydown`, sends
the ASCII character to the PTY, and prevents the later native input events.

This plugin attaches a Tabby `TerminalDecorator` and intercepts eligible ASCII
punctuation during the capture phase. It stops the early event from reaching
xterm.js without calling `preventDefault()`, allowing Sogou to publish the
final character.

The plugin only activates on macOS. It does not intercept:

- letters or digits;
- punctuation already translated to Unicode at `keydown`;
- active composition events;
- Ctrl, Alt, or Command shortcuts.

## Compatibility

Confirmed with:

- Tabby 1.0.235;
- macOS;
- Sogou Input Method 6.24.1.

The workaround is intentionally narrow, but unmodified ASCII punctuation uses
the browser's `keypress`/`input` path while the plugin is enabled. Applications
that depend on advanced terminal keyboard protocols for unmodified punctuation
may observe different key-event encoding.

## Development

```bash
npm test
```

After changing the plugin, install the package into Tabby's user plugin
directory and restart Tabby completely. A successful attachment writes this
debug message in DevTools:

```text
[tabby-sogou-punctuation-fix] attached
```

## 中文说明

这个插件修复 macOS 搜狗输入法在 Tabby 终端中只能输入英文标点的问题。
它会阻止 xterm.js 在 `keydown` 阶段提前提交英文标点，同时保留浏览器默认
输入流程，让搜狗在后续 `keypress/input` 事件中提交最终的中文标点。

## License

[MIT](LICENSE)
