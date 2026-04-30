---
head:
  - - meta
    - itemprop: name
      content: Rux 0.1.0 — It Compiles!
  - - meta
    - itemprop: description
      content: The first Rux compiler release is here. Install it on Windows via Scoop, set up VS Code, and run your first program.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/blog/2026/v0.1.0.webp
  - - meta
    - property: og:url
      content: https://rux-lang.dev/blog/release-v0.1.0
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:title
      content: Rux 0.1.0 — It Compiles!
  - - meta
    - property: og:description
      content: The first Rux compiler release is here. Install it on Windows via Scoop, set up VS Code, and run your first program.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/blog/2026/v0.1.0.webp
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux 0.1.0 — It Compiles!
  - - meta
    - name: twitter:description
      content: The first Rux compiler release is here. Install it on Windows via Scoop, set up VS Code, and run your first program.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/blog/2026/v0.1.0.webp
---

# Rux 0.1.0 — It Compiles!

![Rux v0.1.0](/images/blog/2026/v0.1.0.webp)

That's right. You read it correctly. **Rux 0.1.0 is out**, and it compiles code. Not all code — but code. Real, honest-to-goodness native machine code that runs on your actual computer. We're just as surprised as you are.

## What Can It Do?

Rux 0.1.0 can compile a `Main` function that performs arithmetic operations and returns a result. That's the headline feature. You can add, subtract, multiply, and divide numbers. You could, in theory, compute the answer to the universe — as long as the answer is an integer and you don't need to print it.

```rux
func Main() -> int32 {
    return (6 * 7) + (100 - 58);
}
```

Revolutionary? Perhaps not. But every language starts somewhere, and ours starts with math. Newton would be proud. Probably.

> **Honest limitations:** v0.1.0 compiles simple `Main` functions with arithmetic expressions. No loops, no standard output, no strings, no structs — yet. Those are coming. This is the foundation, and it's solid.

## Installing Rux on Windows

The easiest way to get Rux on Windows is via [Scoop](https://scoop.sh). If you don't have Scoop yet, open PowerShell and run:

```sh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Then add the Rux bucket and install the compiler:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
scoop install rux-lang/rux
```

Verify it worked:

```sh
rux version
```

If you see a version number, congratulations — you are now a Rux developer. Go update your resume.

Full installation guide: [Installation on Windows](/tutorials/install/windows).

## Setting Up VS Code

The [Rux Language](https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux) extension brings syntax highlighting to `.rux` files. Press `Ctrl+P` in VS Code and run:

```
ext install rux-lang.vscode-rux
```

Your Rux code will now look beautiful — even when it doesn't compile yet.

Full setup guide: [Visual Studio Code](/tutorials/editors/vscode).

## Creating Your First Project

```sh
rux new MyApp
cd MyApp
code .
```

This scaffolds a new Rux project with everything you need. Open `Src/Main.rux` and give your `Main` function something to do:

```rux
func Main() -> int32 {
    return 2 + 2;
}
```

Build and run it:

```sh
rux build
rux run
```

That's it. Your first Rux program just ran. It didn't print anything, but internally it returned `4`, which is mathematically correct and emotionally satisfying.

## What's Next?

v0.1.0 is step one of many. The roadmap includes print statements, variables, control flow, functions, and everything else you'd expect from a grown-up language. We're building this in the open, and every release will bring something new.

Follow the project on [GitHub](https://github.com/rux-lang/Rux/releases), join the community on [Discord](https://discord.com/invite/uvSHjtZSVG), and stay tuned.

The best is yet to compile.
