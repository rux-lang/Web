---
head:
  - - meta
    - itemprop: name
      content: Rux 0.3.0 — Laying the Cross-Platform Groundwork
  - - meta
    - itemprop: description
      content: Rux 0.3.0 adds target attributes, Unicode escapes, richer integer literals, new CLI commands, a revamped platform abstraction layer, and many correctness fixes.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/blog/2026/v0.3.0.webp
  - - meta
    - property: og:url
      content: https://rux-lang.dev/blog/release-v0.3.0
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:title
      content: Rux 0.3.0 — Laying the Cross-Platform Groundwork
  - - meta
    - property: og:description
      content: Rux 0.3.0 adds target attributes, Unicode escapes, richer integer literals, new CLI commands, a revamped platform abstraction layer, and many correctness fixes.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/blog/2026/v0.3.0.webp
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux 0.3.0 — Laying the Cross-Platform Groundwork
  - - meta
    - name: twitter:description
      content: Rux 0.3.0 adds target attributes, Unicode escapes, richer integer literals, new CLI commands, a revamped platform abstraction layer, and many correctness fixes.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/blog/2026/v0.3.0.webp
---

# Rux 0.3.0 — Laying the Cross-Platform Groundwork

![Rux v0.3.0](/images/blog/2026/v0.3.0.webp)

In v0.2.0, Rux became a language you could actually write programs in. Rux 0.3.0 sharpens that language — and starts building the machinery to take it everywhere.

**This release is about depth and direction.** It ships target-specific compilation attributes, Unicode escapes, richer integer literals, new CLI commands, a revamped platform abstraction layer, and a pile of correctness fixes. Rux still runs on **Linux and Windows** today, but much of this release is groundwork for the platforms coming next.

Let's go through what's new.

## A New Platform Foundation

Rux currently supports two hosts — **Linux x64** and **Windows x64** — and that's still the case in 0.3.0. What changed is everything underneath.

This release lands a **revamped platform abstraction layer**: a cleaner `Platform` implementation with platform macros and CPU feature detection at runtime. It's the scaffolding that makes adding an operating system a much smaller job than it used to be.

That work is already pointed at what's next. macOS, the BSD family, and illumos are planned for a future release, and the abstraction layer is the foundation that will get them there.

## Target Attributes

With more platforms comes the need to write code that differs between them. The new `@[Target(...)]` attribute conditionally compiles declarations per platform:

```rux
@[Target("Linux")]
func PlatformName() -> char8[] {
    return "Linux";
}

@[Target("Windows")]
func PlatformName() -> char8[] {
    return "Windows";
}
```

Target filtering reaches into your dependencies too. Imports guarded by `@[Target(...)]` are filtered by platform during dependency collection, and `Rux.toml` gained target-specific dependency sections:

```toml
[Dependencies.Target.Linux]
Linux = "0.1.0"

[Dependencies.Target.Windows]
Windows = "0.1.4"
```

## Unicode Escapes

String and character literals now understand `\u{...}` escape sequences:

```rux
let snowman = "\u{2603}"; // ☃
let heart   = '\u{2764}'; // ❤
```

Constant character casts (`as char8`, `as char16`, `as char32`) are validated at compile time, so out-of-range values and Unicode surrogate code points are rejected before they ever reach a binary.

## Richer Literals and Constants

Integer literals got a serious upgrade. Typed suffixes and underscore separators now work across every base:

```rux
let a = 0xFFu; // unsigned
let c = 0o17i; // signed octal
```

Constant integer expressions that are folded at compile time now coerce to sized integer targets when the value fits, and unsigned/sized literal handling is finally consistent across decimal, hex, binary, and octal forms. Boolean types also picked up bitwise operators — `&`, `|`, `^`, and `~` now work on `bool`.

## What's Next?

With 0.3.0, Rux runs on Linux and Windows, compiles code that adapts to where it lands, and now stands on a platform abstraction layer built to grow. The foundation for a genuinely cross-platform language is in place.

Still ahead: macOS, BSD, and illumos host support, plus cross-compilation, a broader standard library, generics, and richer error handling.

Follow along on [GitHub](https://github.com/rux-lang/Rux/releases), and join the conversation on [Discord](https://discord.com/invite/uvSHjtZSVG).

Two platforms down. More on the way.
