# Target

Limits a declaration to a specific operating system. The compiler ignores the annotated item when building for any other target.

## Syntax

```rux
@[Target("Linux")]
func Do() {
    // Implementation
}
```

Valid operating system strings:

| Attribute              | Operating system                           |
| ---------------------- | ------------------------------------------ |
| `@[Target("BSD")]`     | FreeBSD / OpenBSD / NetBSD / DragonFly BSD |
| `@[Target("Illumos")]` | Illumos / OmniOS                           |
| `@[Target("Linux")]`   | Linux                                      |
| `@[Target("MacOS")]`   | macOS                                      |
| `@[Target("Windows")]` | Windows                                    |

## Examples

### Platform-specific imports

```rux
@[Target("Linux")]
import Linux::LinuxHelper;

@[Target("Windows")]
import Windows::WinHelper;
```

Only the import that matches the current build target is resolved. The others are silently skipped, so their packages do not need to be listed in `[Dependencies]` for all platforms — only under the corresponding `[Dependencies.Target.<OS>]` section.

### Platform-specific functions

These attributes enable the creation of multi-platform packages with a specified interface.

```rux
@[Target("Linux")]
func CreateFile(filename: String) {
    // Platform-specific implementation for Linux
}

@[Target("MacOS")]
func CreateFile(filename: String) {
    // Platform-specific implementation for macOS
}

@[Target("Windows")]
func CreateFile(filename: String) {
    // Platform-specific implementation for Windows
}
```

Multiple attributes may be stacked before a single declaration.

```rux
@[Target("Windows")]
@[Import(lib: "User32.dll")]
extern func MessageBoxA(
    hwnd: *opaque,
    text: *char8,
    caption: *char8,
    type: uint32) -> int32;
```

The compiler will use the functions only for the current target.

```rux
@[Target("Linux")]
@[Import(lib: "librt.so")]
extern func clock_gettime(clockid: int32, tp: *opaque) -> int32;

@[Target("Windows")]
@[Import(lib: "Kernel32.dll")]
extern func GetTickCount64() -> uint64;
```
