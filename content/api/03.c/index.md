---
navigation:
  title: Overview
---

# C Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

Thin bindings to the platform C standard library for Rux programs.

**Package:** `C`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/C](https://github.com/rux-lang/Rux/tree/main/Packages/C)

The package links the platform C library through `#Link` and exposes its functions directly — the math library (`libm`), standard I/O, the general utilities, and the time functions. Each entry is a 1:1 binding to the C function of the same name, so the authoritative behavior is the C standard and the linked reference on every page.

## Requirements

- A target with a C standard library — every supported OS (BSD, Linux, macOS, Windows) ships one, selected automatically per target.

Each function follows the C calling convention and the C contract exactly: no argument checking, no errno decoding, and no memory management beyond what the C function itself does. Prefer the cross-platform packages ([`Math`](/api/math), [`Io`](/api/io), [`Memory`](/api/memory)) for portable application code, and reach for these bindings when you need the C library specifically.

## Installation

```sh
rux add C
rux install
```

Then import the symbols you need:

```rux
import C::{ printf, malloc, free };
```

## Types

| Type                       | Description                                   |
| -------------------------- | --------------------------------------------- |
| [`time_t`](/api/c/types)   | Arithmetic type representing a calendar time. |
| [`clock_t`](/api/c/types)  | Arithmetic type representing processor time.  |
| [`tm`](/api/c/types)       | Calendar time broken into its components.     |
| [`timespec`](/api/c/types) | A time in seconds and nanoseconds.            |

## Math

| Function                          | Description                                                                                  |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| [`acosf`](/api/c/acosf)           | Computes arc cosine.                                                                         |
| [`acos`](/api/c/acos)             | Computes arc cosine.                                                                         |
| [`acoshf`](/api/c/acoshf)         | Computes inverse hyperbolic cosine.                                                          |
| [`acosh`](/api/c/acosh)           | Computes inverse hyperbolic cosine.                                                          |
| [`asinf`](/api/c/asinf)           | Computes arc sine.                                                                           |
| [`asin`](/api/c/asin)             | Computes arc sine.                                                                           |
| [`asinhf`](/api/c/asinhf)         | Computes inverse hyperbolic sine.                                                            |
| [`asinh`](/api/c/asinh)           | Computes inverse hyperbolic sine.                                                            |
| [`atanf`](/api/c/atanf)           | Computes arc tangent.                                                                        |
| [`atan`](/api/c/atan)             | Computes arc tangent.                                                                        |
| [`atan2f`](/api/c/atan2f)         | Computes arc tangent, using signs to determine quadrants.                                    |
| [`atan2`](/api/c/atan2)           | Computes arc tangent, using signs to determine quadrants.                                    |
| [`atanhf`](/api/c/atanhf)         | Computes inverse hyperbolic tangent.                                                         |
| [`atanh`](/api/c/atanh)           | Computes inverse hyperbolic tangent.                                                         |
| [`cbrtf`](/api/c/cbrtf)           | Computes cube root.                                                                          |
| [`cbrt`](/api/c/cbrt)             | Computes cube root.                                                                          |
| [`ceilf`](/api/c/ceilf)           | Computes smallest integer not less than the given value.                                     |
| [`ceil`](/api/c/ceil)             | Computes smallest integer not less than the given value.                                     |
| [`copysignf`](/api/c/copysignf)   | Copies the sign of a floating-point value.                                                   |
| [`copysign`](/api/c/copysign)     | Copies the sign of a floating-point value.                                                   |
| [`cosf`](/api/c/cosf)             | Computes cosine.                                                                             |
| [`cos`](/api/c/cos)               | Computes cosine.                                                                             |
| [`coshf`](/api/c/coshf)           | Computes hyperbolic cosine.                                                                  |
| [`cosh`](/api/c/cosh)             | Computes hyperbolic cosine.                                                                  |
| [`erff`](/api/c/erff)             | Computes error function.                                                                     |
| [`erf`](/api/c/erf)               | Computes error function.                                                                     |
| [`erfcf`](/api/c/erfcf)           | Computes complementary error function.                                                       |
| [`erfc`](/api/c/erfc)             | Computes complementary error function.                                                       |
| [`expf`](/api/c/expf)             | Computes e raised to the given power.                                                        |
| [`exp`](/api/c/exp)               | Computes e raised to the given power.                                                        |
| [`exp2f`](/api/c/exp2f)           | Computes 2 raised to the given power.                                                        |
| [`exp2`](/api/c/exp2)             | Computes 2 raised to the given power.                                                        |
| [`expm1f`](/api/c/expm1f)         | Computes e raised to the given power, minus one.                                             |
| [`expm1`](/api/c/expm1)           | Computes e raised to the given power, minus one.                                             |
| [`fabs`](/api/c/fabs)             | Computes the absolute value of a floating-point value.                                       |
| [`fdimf`](/api/c/fdimf)           | Computes positive difference of two floating-point values.                                   |
| [`fdim`](/api/c/fdim)             | Computes positive difference of two floating-point values.                                   |
| [`floorf`](/api/c/floorf)         | Computes largest integer not greater than the given value.                                   |
| [`floor`](/api/c/floor)           | Computes largest integer not greater than the given value.                                   |
| [`fmaf`](/api/c/fmaf)             | Computes fused multiply-add.                                                                 |
| [`fma`](/api/c/fma)               | Computes fused multiply-add.                                                                 |
| [`fmaxf`](/api/c/fmaxf)           | Computes larger of two floating-point values.                                                |
| [`fmax`](/api/c/fmax)             | Computes larger of two floating-point values.                                                |
| [`fminf`](/api/c/fminf)           | Computes smaller of two floating-point values.                                               |
| [`fmin`](/api/c/fmin)             | Computes smaller of two floating-point values.                                               |
| [`fmodf`](/api/c/fmodf)           | Computes remainder of the floating-point division operation.                                 |
| [`fmod`](/api/c/fmod)             | Computes remainder of the floating-point division operation.                                 |
| [`frexp`](/api/c/frexp)           | Decomposes a number into significand and a power of two.                                     |
| [`hypot`](/api/c/hypot)           | Computes square root of the sum of the squares of two given numbers.                         |
| [`ilogbf`](/api/c/ilogbf)         | Extracts exponent of the number.                                                             |
| [`ilogb`](/api/c/ilogb)           | Extracts exponent of the number.                                                             |
| [`ldexp`](/api/c/ldexp)           | Multiplies a number by 2 raised to an integer power.                                         |
| [`lgammaf`](/api/c/lgammaf)       | Computes natural logarithm of the absolute value of the gamma function.                      |
| [`lgamma`](/api/c/lgamma)         | Computes natural logarithm of the absolute value of the gamma function.                      |
| [`llrintf`](/api/c/llrintf)       | Rounds to nearest integer using current rounding mode.                                       |
| [`llrint`](/api/c/llrint)         | Rounds to nearest integer using current rounding mode.                                       |
| [`llroundf`](/api/c/llroundf)     | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`llround`](/api/c/llround)       | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`logf`](/api/c/logf)             | Computes natural (base e) logarithm.                                                         |
| [`log`](/api/c/log)               | Computes natural (base e) logarithm.                                                         |
| [`log10f`](/api/c/log10f)         | Computes common (base 10) logarithm.                                                         |
| [`log10`](/api/c/log10)           | Computes common (base 10) logarithm.                                                         |
| [`log1pf`](/api/c/log1pf)         | Computes natural logarithm of 1 plus the given number.                                       |
| [`log1p`](/api/c/log1p)           | Computes natural logarithm of 1 plus the given number.                                       |
| [`log2f`](/api/c/log2f)           | Computes base 2 logarithm.                                                                   |
| [`log2`](/api/c/log2)             | Computes base 2 logarithm.                                                                   |
| [`logbf`](/api/c/logbf)           | Extracts exponent of the number.                                                             |
| [`logb`](/api/c/logb)             | Extracts exponent of the number.                                                             |
| [`lrintf`](/api/c/lrintf)         | Rounds to nearest integer using current rounding mode.                                       |
| [`lrint`](/api/c/lrint)           | Rounds to nearest integer using current rounding mode.                                       |
| [`lroundf`](/api/c/lroundf)       | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`lround`](/api/c/lround)         | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`modff`](/api/c/modff)           | Decomposes a number into integer and fractional parts.                                       |
| [`modf`](/api/c/modf)             | Decomposes a number into integer and fractional parts.                                       |
| [`nanf`](/api/c/nanf)             | Generates a quiet NaN.                                                                       |
| [`nan`](/api/c/nan)               | Generates a quiet NaN.                                                                       |
| [`nearbyintf`](/api/c/nearbyintf) | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nearbyint`](/api/c/nearbyint)   | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nextafterf`](/api/c/nextafterf) | Determines next representable floating-point value toward the given value.                   |
| [`nextafter`](/api/c/nextafter)   | Determines next representable floating-point value toward the given value.                   |
| [`powf`](/api/c/powf)             | Computes a number raised to the given power.                                                 |
| [`pow`](/api/c/pow)               | Computes a number raised to the given power.                                                 |
| [`remainderf`](/api/c/remainderf) | Computes signed remainder of the floating-point division operation.                          |
| [`remainder`](/api/c/remainder)   | Computes signed remainder of the floating-point division operation.                          |
| [`remquof`](/api/c/remquof)       | Computes signed remainder as well as the three last bits of the division operation.          |
| [`remquo`](/api/c/remquo)         | Computes signed remainder as well as the three last bits of the division operation.          |
| [`rintf`](/api/c/rintf)           | Rounds to nearest integer using current rounding mode.                                       |
| [`rint`](/api/c/rint)             | Rounds to nearest integer using current rounding mode.                                       |
| [`roundf`](/api/c/roundf)         | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`round`](/api/c/round)           | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`scalbnf`](/api/c/scalbnf)       | Multiplies a number by FLT_RADIX raised to an integer power.                                 |
| [`scalbn`](/api/c/scalbn)         | Multiplies a number by FLT_RADIX raised to an integer power.                                 |
| [`sinf`](/api/c/sinf)             | Computes sine.                                                                               |
| [`sin`](/api/c/sin)               | Computes sine.                                                                               |
| [`sinhf`](/api/c/sinhf)           | Computes hyperbolic sine.                                                                    |
| [`sinh`](/api/c/sinh)             | Computes hyperbolic sine.                                                                    |
| [`sqrtf`](/api/c/sqrtf)           | Computes square root.                                                                        |
| [`sqrt`](/api/c/sqrt)             | Computes square root.                                                                        |
| [`tanf`](/api/c/tanf)             | Computes tangent.                                                                            |
| [`tan`](/api/c/tan)               | Computes tangent.                                                                            |
| [`tanhf`](/api/c/tanhf)           | Computes hyperbolic tangent.                                                                 |
| [`tanh`](/api/c/tanh)             | Computes hyperbolic tangent.                                                                 |
| [`tgammaf`](/api/c/tgammaf)       | Computes gamma function.                                                                     |
| [`tgamma`](/api/c/tgamma)         | Computes gamma function.                                                                     |
| [`truncf`](/api/c/truncf)         | Rounds to nearest integer not greater in magnitude than the given value.                     |
| [`trunc`](/api/c/trunc)           | Rounds to nearest integer not greater in magnitude than the given value.                     |

## Standard I/O

| Function                      | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| [`clearerr`](/api/c/clearerr) | Clears the end-of-file and error indicators for the given stream.          |
| [`fclose`](/api/c/fclose)     | Closes the given file stream.                                              |
| [`feof`](/api/c/feof)         | Checks if the end-of-file indicator is set for the given stream.           |
| [`ferror`](/api/c/ferror)     | Checks if the error indicator is set for the given stream.                 |
| [`fflush`](/api/c/fflush)     | Writes any unwritten data from the stream's buffer to the file.            |
| [`fgetc`](/api/c/fgetc)       | Reads the next character from the given stream.                            |
| [`fgetpos`](/api/c/fgetpos)   | Gets the current file position of the stream.                              |
| [`fgets`](/api/c/fgets)       | Reads at most count-1 characters from the stream into a string.            |
| [`fopen`](/api/c/fopen)       | Opens a file indicated by filename with the given mode.                    |
| [`fprintf`](/api/c/fprintf)   | Prints formatted output to a file stream.                                  |
| [`fputc`](/api/c/fputc)       | Writes a character to the given stream.                                    |
| [`fputs`](/api/c/fputs)       | Writes a string to the given stream.                                       |
| [`fread`](/api/c/fread)       | Reads up to count objects of the given size from the stream into a buffer. |
| [`freopen`](/api/c/freopen)   | Reopens a stream with a different file or mode.                            |
| [`fscanf`](/api/c/fscanf)     | Reads formatted input from a file stream.                                  |
| [`fseek`](/api/c/fseek)       | Sets the file position indicator for the stream.                           |
| [`fsetpos`](/api/c/fsetpos)   | Sets the file position of the stream to the given position.                |
| [`ftell`](/api/c/ftell)       | Returns the current file position of the stream.                           |
| [`fwrite`](/api/c/fwrite)     | Writes count objects of the given size from a buffer to the stream.        |
| [`getc`](/api/c/getc)         | Reads the next character from the given stream.                            |
| [`getchar`](/api/c/getchar)   | Reads the next character from stdin.                                       |
| [`perror`](/api/c/perror)     | Prints an error message describing the last error to stderr.               |
| [`printf`](/api/c/printf)     | Prints formatted output to stdout.                                         |
| [`putc`](/api/c/putc)         | Writes a character to the given stream.                                    |
| [`putchar`](/api/c/putchar)   | Writes a character to stdout.                                              |
| [`puts`](/api/c/puts)         | Writes a string followed by a newline to stdout.                           |
| [`remove`](/api/c/remove)     | Deletes the file identified by the given path.                             |
| [`rename`](/api/c/rename)     | Renames a file, moving it if necessary.                                    |
| [`rewind`](/api/c/rewind)     | Moves the file position indicator to the beginning of the stream.          |
| [`scanf`](/api/c/scanf)       | Reads formatted input from stdin.                                          |
| [`setbuf`](/api/c/setbuf)     | Sets the buffer to be used by the given stream.                            |
| [`setvbuf`](/api/c/setvbuf)   | Sets the buffering mode and buffer to be used by the given stream.         |
| [`sprintf`](/api/c/sprintf)   | Prints formatted output to a string.                                       |
| [`sscanf`](/api/c/sscanf)     | Reads formatted input from a string.                                       |
| [`tmpfile`](/api/c/tmpfile)   | Creates and opens a temporary file with a unique name.                     |
| [`tmpnam`](/api/c/tmpnam)     | Generates a unique filename that does not name an existing file.           |
| [`ungetc`](/api/c/ungetc)     | Puts a character back into the given stream.                               |

## Standard library

| Function                    | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| [`abort`](/api/c/abort)     | Causes abnormal program termination without cleaning up.                      |
| [`abs`](/api/c/abs)         | Computes the absolute value of an integer value.                              |
| [`atof`](/api/c/atof)       | Converts a byte string to a floating point value.                             |
| [`atoi`](/api/c/atoi)       | Converts a byte string to an integer value.                                   |
| [`atol`](/api/c/atol)       | Converts a byte string to a long integer value.                               |
| [`atoll`](/api/c/atoll)     | Converts a byte string to a long long integer value.                          |
| [`calloc`](/api/c/calloc)   | Allocates memory for an array of num objects of size and zero-initializes it. |
| [`exit`](/api/c/exit)       | Causes normal program termination with cleanup.                               |
| [`free`](/api/c/free)       | Deallocates the memory previously allocated by malloc, calloc or realloc.     |
| [`getenv`](/api/c/getenv)   | Returns the value of an environment variable.                                 |
| [`labs`](/api/c/labs)       | Computes the absolute value of a long integer value.                          |
| [`llabs`](/api/c/llabs)     | Computes the absolute value of a long long integer value.                     |
| [`malloc`](/api/c/malloc)   | Allocates size bytes of uninitialized memory.                                 |
| [`rand`](/api/c/rand)       | Returns a pseudo-random integer value between 0 and RAND_MAX.                 |
| [`realloc`](/api/c/realloc) | Changes the size of the memory block pointed to by ptr to size bytes.         |
| [`srand`](/api/c/srand)     | Seeds the pseudo-random number generator used by rand.                        |
| [`system`](/api/c/system)   | Calls the host environment's command processor.                               |

## Time

| Function                        | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| [`asctime`](/api/c/asctime)     | Converts a tm object to a textual representation.                        |
| [`clock`](/api/c/clock)         | Returns the approximate processor time used by the program.              |
| [`ctime`](/api/c/ctime)         | Converts a time_t object to a textual representation.                    |
| [`difftime`](/api/c/difftime)   | Computes the difference in seconds between two calendar times.           |
| [`gmtime`](/api/c/gmtime)       | Converts a time_t object to calendar time expressed as UTC.              |
| [`localtime`](/api/c/localtime) | Converts a time_t object to calendar time expressed as local time.       |
| [`mktime`](/api/c/mktime)       | Converts calendar time to a time_t object, normalizing the tm structure. |
| [`strftime`](/api/c/strftime)   | Converts a tm object to a custom textual representation.                 |
| [`time`](/api/c/time)           | Returns the current calendar time since the epoch.                       |
