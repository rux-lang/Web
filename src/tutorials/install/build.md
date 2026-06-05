# Building the Rux Compiler From Source

Instructions on how to build the Rux compiler from source

## Supported Kernels

- Windows (NT kernel)
- Linux 
- BSD
- Illumos (Solaris)

## Requirements

- Cmake Version 3.30+
- GCC14+ or Clang 18+ or MSVC 2022+

## Clone the Git Hub Repository

There are two branches of the Rux compiler currently available,

- main (The most stable release of the compiler)
- dev (The branch with the latest updates from the community, may break)

### Install Main Branch

```sh
git clone https://github.com/rux-lang/rux
cd rux
```

### Install Dev Branch

```sh
git clone -b dev https://github.com/rux-lang/rux rux-dev
cd rux-dev
```

## Build the Rux Compiler

Create the build enviorement

```sh
mkdir build && cd build
cmake ..
```

Initiate the build

```sh
cmake --build .
```

## Add the Binary to Global User Paths

### Windows

- Open Environment Variables
- Add the build path to the global Path

### Linux

Go into the build directory

```sh
cp rux ~/.local/bin/
```

### BSD/Illumos

Go into the build directory

```sh
cp rux ~/.local/bin/
```

Initialize the path in your specific shells


## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
