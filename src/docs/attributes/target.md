## `@[Target("OS")]`

Limits a declaration to a specific operating system. The compiler ignores the annotated item when building for any other target.

**Syntax**

```rux
@[Target("<os>")]
<declaration>
```

Valid OS strings:

| Value       | Platform                                   |
| ----------- | ------------------------------------------ |
| `"Windows"` | Windows                                    |
| `"Linux"`   | Linux                                      |
| `"macOS"`   | macOS                                      |
| `"BSD"`     | FreeBSD / OpenBSD / NetBSD / DragonFly BSD |
| `"Illumos"` | Illumos / OmniOS                           |

**Example — platform-specific imports**

```rux
@[Target("Linux")]
import LinuxHelper::LinuxHelper;

@[Target("macOS")]
import MacosHelper::MacosHelper;

@[Target("Windows")]
import WinHelper::WinHelper;
```

Only the import that matches the current build target is resolved. The others are silently skipped, so their packages do not need to be listed in `[Dependencies]` for all platforms — only under the corresponding `[Dependencies.Target.<OS>]` section.

**Example — platform-specific extern functions**

```rux
@[Target("Windows")]
@[Import(lib: "kernel32")]
extern func GetTickCount64() -> uint64;

@[Target("Linux")]
@[Import(lib: "librt")]
extern func clock_gettime(clockid: int32, tp: *opaque) -> int32;
```
