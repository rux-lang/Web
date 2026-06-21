# Install on macOS

::: warning
The macOS release is still in development. Since there is no native installer or package yet, these instructions will change.
:::

A dedicated macOS package is not available at this time. While native support is being worked on, you can run Rux on macOS by [building the compiler from source](/start/build) — the build toolchain works anywhere a supported C++ compiler and CMake are available, including macOS.

## Verify the Installation

Once built and on your `PATH`, confirm the compiler is available:

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
