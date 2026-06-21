# Text Conversion

Convert between multibyte encodings and UTF-16.

**Module:** `Windows`

| Function                                       | Description                         |
| ---------------------------------------------- | ----------------------------------- |
| [`MultiByteToWideChar`](multibytetowidechar)   | Convert multibyte text to UTF-16.   |
| [`WideCharToMultiByte`](widechartomultibyte)   | Convert UTF-16 to multibyte text.   |

Use [`CodePage`](codepage) to select an encoding. Both functions support a
size-query call before allocating the destination buffer.

