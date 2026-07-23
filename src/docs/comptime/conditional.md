# Conditional Compilation

`when` is the compile-time counterpart of [`if`](/docs/statements/if). It has the same shape, but the compiler evaluates its condition against the [build context](/docs/comptime/context) **before** semantic analysis, keeps the branch that is taken, and discards the rest. Only the taken branch is type-checked and lowered.

```rux
import Rux::{ #target };

when #target.os == .Windows {
    Print("Built for Windows");
} else {
    Print("Built for a Unix-like system");
}
```

Because the untaken branches are removed before analysis, they may reference symbols — functions, libraries, types — that do not exist on the current build. This is what makes `when` the tool for platform- and configuration-specific code.

## Chained Form

Like `if`, a `when` may chain with `else when` and end in a bare `else`. A chain must stay on `when` throughout; mixing `if` and `when` in one chain is an error, so it is always clear which arms the compiler resolves and which the program tests at run time.

```rux
import Rux::{ #build };

when #build.mode == .Release {
    UseFastPath();
} else when #build.debugAssertions {
    UseCheckedPath();
} else {
    UseDefaultPath();
}
```

## Match Form

When you are selecting among the variants of one value, the match form is clearer than a chain of `==` comparisons. It lists comma-separated patterns before `=>`; an arm is taken when any of its patterns match, and a trailing `else` handles the rest.

```rux
import Rux::{ #target };

when #target.os {
    .Windows          => UseWin32(),
    .Linux, .FreeBSD  => UsePosix(),
    .MacOS            => UseDarwin(),
    else              => UseFallback(),
}
```

An arm body may be a single expression, as above, or a `{ ... }` block.

## Where `when` Can Appear

`when` folds into whatever list encloses it, so it works in two places:

- **Statement position**, inside a function body, to choose between statements.
- **Declaration position**, at module or package scope, to choose which declarations exist at all.

```rux
import Rux::{ #target };

// Declaration-level: only one CreateFile is compiled into the program.
when #target.os == .Windows {
    func CreateFile(path: Slice<char8>) { /* Win32 */ }
} else {
    func CreateFile(path: Slice<char8>) { /* POSIX */ }
}
```

This replaces the older per-declaration platform attribute: platform selection is expressed with `when #target.os`, and platform-specific [imports](/docs/modules/import) are guarded the same way.

## Conditions

A condition is any expression the compiler can fold to a `bool`. In practice it combines [build-context](/docs/comptime/context) fields, [constants](/docs/constants/overview), and literals with:

| Operators                     | Operand types                                   |
| ----------------------------- | ----------------------------------------------- |
| `==` `!=`                     | Any context value, including enum variants      |
| `<` `<=` `>` `>=`             | Numbers and [`#compiler.version`](/docs/comptime/context#compiler) |
| `&&` `\|\|` `!`               | Booleans                                        |

Enum-valued fields such as `#target.os` compare only for **equality** — write `#target.os == .Windows`, not `<`. The `.Windows` shorthand takes its enum from the other side of the comparison.

```rux
import Rux::{ #target, #compiler };

when #target.pointerBits == 64 && #compiler.version >= SemanticVersion::New(0, 3, 0) {
    UseWideIndex();
}
```

## Naming an Unbuildable Target

`#target.os` can name systems Rux does not yet build for. Comparing against one is allowed — so code can be written ahead of support — but the compiler **warns**, since that branch can never be selected on a current build. Comparisons against buildable systems (Windows, Linux, the BSDs, macOS, Illumos, Solaris) never warn.

## See Also

- [Build Context](/docs/comptime/context) — the fields and methods a `when` condition reads
- [Overview](/docs/comptime/overview) — compile-time programming as a whole
- [`if` / `else`](/docs/statements/if) — the run-time conditional `when` mirrors
- [Import](/docs/modules/import) — guarding platform-specific imports with `when`
