# Install on illumos

::: warning
The illumos release is still in development. Since there is no native installer or package yet, these instructions will change.
:::

A dedicated illumos package is not available at this time. While native support for illumos, OmniOS, and Solaris is being worked on, you can run Rux on illumos by [building the compiler from source](/start/build) — the build toolchain works anywhere a supported C++ compiler and CMake are available, including illumos.

## Verify the Installation

Once built and on your `PATH`, confirm the compiler is available:

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
