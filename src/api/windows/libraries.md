# Dynamic Libraries

Load DLLs and resolve exported function addresses.

**Module:** `Windows`

| Function                               | Description                         |
| -------------------------------------- | ----------------------------------- |
| [`FreeLibrary`](freelibrary)           | Release a loaded module reference.  |
| [`GetProcAddress`](getprocaddress)     | Resolve an exported symbol.         |
| [`LoadLibraryA`](loadlibrarya)         | Load a DLL.                         |

Resolved addresses remain valid only while their module is loaded. Use trusted
DLL paths to avoid loading an unintended library through Windows search order.
