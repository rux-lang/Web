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

Each function follows the C calling convention and the C contract exactly: no argument checking, no errno decoding, and no memory management beyond what the C function itself does. Prefer the cross-platform packages ([`Math`](/docs/api/math), [`Io`](/docs/api/io), [`Memory`](/docs/api/memory)) for portable application code, and reach for these bindings when you need the C library specifically.

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

| Type                            | Description                                   |
| ------------------------------- | --------------------------------------------- |
| [`time_t`](/docs/api/c/types)   | Arithmetic type representing a calendar time. |
| [`clock_t`](/docs/api/c/types)  | Arithmetic type representing processor time.  |
| [`tm`](/docs/api/c/types)       | Calendar time broken into its components.     |
| [`timespec`](/docs/api/c/types) | A time in seconds and nanoseconds.            |

## Math

| Function                               | Description                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`acosf`](/docs/api/c/acosf)           | Computes arc cosine.                                                                         |
| [`acos`](/docs/api/c/acos)             | Computes arc cosine.                                                                         |
| [`acoshf`](/docs/api/c/acoshf)         | Computes inverse hyperbolic cosine.                                                          |
| [`acosh`](/docs/api/c/acosh)           | Computes inverse hyperbolic cosine.                                                          |
| [`asinf`](/docs/api/c/asinf)           | Computes arc sine.                                                                           |
| [`asin`](/docs/api/c/asin)             | Computes arc sine.                                                                           |
| [`asinhf`](/docs/api/c/asinhf)         | Computes inverse hyperbolic sine.                                                            |
| [`asinh`](/docs/api/c/asinh)           | Computes inverse hyperbolic sine.                                                            |
| [`atanf`](/docs/api/c/atanf)           | Computes arc tangent.                                                                        |
| [`atan`](/docs/api/c/atan)             | Computes arc tangent.                                                                        |
| [`atan2f`](/docs/api/c/atan2f)         | Computes arc tangent, using signs to determine quadrants.                                    |
| [`atan2`](/docs/api/c/atan2)           | Computes arc tangent, using signs to determine quadrants.                                    |
| [`atanhf`](/docs/api/c/atanhf)         | Computes inverse hyperbolic tangent.                                                         |
| [`atanh`](/docs/api/c/atanh)           | Computes inverse hyperbolic tangent.                                                         |
| [`cbrtf`](/docs/api/c/cbrtf)           | Computes cube root.                                                                          |
| [`cbrt`](/docs/api/c/cbrt)             | Computes cube root.                                                                          |
| [`ceilf`](/docs/api/c/ceilf)           | Computes smallest integer not less than the given value.                                     |
| [`ceil`](/docs/api/c/ceil)             | Computes smallest integer not less than the given value.                                     |
| [`copysignf`](/docs/api/c/copysignf)   | Copies the sign of a floating-point value.                                                   |
| [`copysign`](/docs/api/c/copysign)     | Copies the sign of a floating-point value.                                                   |
| [`cosf`](/docs/api/c/cosf)             | Computes cosine.                                                                             |
| [`cos`](/docs/api/c/cos)               | Computes cosine.                                                                             |
| [`coshf`](/docs/api/c/coshf)           | Computes hyperbolic cosine.                                                                  |
| [`cosh`](/docs/api/c/cosh)             | Computes hyperbolic cosine.                                                                  |
| [`erff`](/docs/api/c/erff)             | Computes error function.                                                                     |
| [`erf`](/docs/api/c/erf)               | Computes error function.                                                                     |
| [`erfcf`](/docs/api/c/erfcf)           | Computes complementary error function.                                                       |
| [`erfc`](/docs/api/c/erfc)             | Computes complementary error function.                                                       |
| [`expf`](/docs/api/c/expf)             | Computes e raised to the given power.                                                        |
| [`exp`](/docs/api/c/exp)               | Computes e raised to the given power.                                                        |
| [`exp2f`](/docs/api/c/exp2f)           | Computes 2 raised to the given power.                                                        |
| [`exp2`](/docs/api/c/exp2)             | Computes 2 raised to the given power.                                                        |
| [`expm1f`](/docs/api/c/expm1f)         | Computes e raised to the given power, minus one.                                             |
| [`expm1`](/docs/api/c/expm1)           | Computes e raised to the given power, minus one.                                             |
| [`fabs`](/docs/api/c/fabs)             | Computes the absolute value of a floating-point value.                                       |
| [`fdimf`](/docs/api/c/fdimf)           | Computes positive difference of two floating-point values.                                   |
| [`fdim`](/docs/api/c/fdim)             | Computes positive difference of two floating-point values.                                   |
| [`floorf`](/docs/api/c/floorf)         | Computes largest integer not greater than the given value.                                   |
| [`floor`](/docs/api/c/floor)           | Computes largest integer not greater than the given value.                                   |
| [`fmaf`](/docs/api/c/fmaf)             | Computes fused multiply-add.                                                                 |
| [`fma`](/docs/api/c/fma)               | Computes fused multiply-add.                                                                 |
| [`fmaxf`](/docs/api/c/fmaxf)           | Computes larger of two floating-point values.                                                |
| [`fmax`](/docs/api/c/fmax)             | Computes larger of two floating-point values.                                                |
| [`fminf`](/docs/api/c/fminf)           | Computes smaller of two floating-point values.                                               |
| [`fmin`](/docs/api/c/fmin)             | Computes smaller of two floating-point values.                                               |
| [`fmodf`](/docs/api/c/fmodf)           | Computes remainder of the floating-point division operation.                                 |
| [`fmod`](/docs/api/c/fmod)             | Computes remainder of the floating-point division operation.                                 |
| [`frexp`](/docs/api/c/frexp)           | Decomposes a number into significand and a power of two.                                     |
| [`hypot`](/docs/api/c/hypot)           | Computes square root of the sum of the squares of two given numbers.                         |
| [`ilogbf`](/docs/api/c/ilogbf)         | Extracts exponent of the number.                                                             |
| [`ilogb`](/docs/api/c/ilogb)           | Extracts exponent of the number.                                                             |
| [`ldexp`](/docs/api/c/ldexp)           | Multiplies a number by 2 raised to an integer power.                                         |
| [`lgammaf`](/docs/api/c/lgammaf)       | Computes natural logarithm of the absolute value of the gamma function.                      |
| [`lgamma`](/docs/api/c/lgamma)         | Computes natural logarithm of the absolute value of the gamma function.                      |
| [`llrintf`](/docs/api/c/llrintf)       | Rounds to nearest integer using current rounding mode.                                       |
| [`llrint`](/docs/api/c/llrint)         | Rounds to nearest integer using current rounding mode.                                       |
| [`llroundf`](/docs/api/c/llroundf)     | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`llround`](/docs/api/c/llround)       | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`logf`](/docs/api/c/logf)             | Computes natural (base e) logarithm.                                                         |
| [`log`](/docs/api/c/log)               | Computes natural (base e) logarithm.                                                         |
| [`log10f`](/docs/api/c/log10f)         | Computes common (base 10) logarithm.                                                         |
| [`log10`](/docs/api/c/log10)           | Computes common (base 10) logarithm.                                                         |
| [`log1pf`](/docs/api/c/log1pf)         | Computes natural logarithm of 1 plus the given number.                                       |
| [`log1p`](/docs/api/c/log1p)           | Computes natural logarithm of 1 plus the given number.                                       |
| [`log2f`](/docs/api/c/log2f)           | Computes base 2 logarithm.                                                                   |
| [`log2`](/docs/api/c/log2)             | Computes base 2 logarithm.                                                                   |
| [`logbf`](/docs/api/c/logbf)           | Extracts exponent of the number.                                                             |
| [`logb`](/docs/api/c/logb)             | Extracts exponent of the number.                                                             |
| [`lrintf`](/docs/api/c/lrintf)         | Rounds to nearest integer using current rounding mode.                                       |
| [`lrint`](/docs/api/c/lrint)           | Rounds to nearest integer using current rounding mode.                                       |
| [`lroundf`](/docs/api/c/lroundf)       | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`lround`](/docs/api/c/lround)         | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`modff`](/docs/api/c/modff)           | Decomposes a number into integer and fractional parts.                                       |
| [`modf`](/docs/api/c/modf)             | Decomposes a number into integer and fractional parts.                                       |
| [`nanf`](/docs/api/c/nanf)             | Generates a quiet NaN.                                                                       |
| [`nan`](/docs/api/c/nan)               | Generates a quiet NaN.                                                                       |
| [`nearbyintf`](/docs/api/c/nearbyintf) | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nearbyint`](/docs/api/c/nearbyint)   | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nextafterf`](/docs/api/c/nextafterf) | Determines next representable floating-point value toward the given value.                   |
| [`nextafter`](/docs/api/c/nextafter)   | Determines next representable floating-point value toward the given value.                   |
| [`powf`](/docs/api/c/powf)             | Computes a number raised to the given power.                                                 |
| [`pow`](/docs/api/c/pow)               | Computes a number raised to the given power.                                                 |
| [`remainderf`](/docs/api/c/remainderf) | Computes signed remainder of the floating-point division operation.                          |
| [`remainder`](/docs/api/c/remainder)   | Computes signed remainder of the floating-point division operation.                          |
| [`remquof`](/docs/api/c/remquof)       | Computes signed remainder as well as the three last bits of the division operation.          |
| [`remquo`](/docs/api/c/remquo)         | Computes signed remainder as well as the three last bits of the division operation.          |
| [`rintf`](/docs/api/c/rintf)           | Rounds to nearest integer using current rounding mode.                                       |
| [`rint`](/docs/api/c/rint)             | Rounds to nearest integer using current rounding mode.                                       |
| [`roundf`](/docs/api/c/roundf)         | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`round`](/docs/api/c/round)           | Rounds to nearest integer, rounding away from zero in halfway cases.                         |
| [`scalbnf`](/docs/api/c/scalbnf)       | Multiplies a number by FLT_RADIX raised to an integer power.                                 |
| [`scalbn`](/docs/api/c/scalbn)         | Multiplies a number by FLT_RADIX raised to an integer power.                                 |
| [`sinf`](/docs/api/c/sinf)             | Computes sine.                                                                               |
| [`sin`](/docs/api/c/sin)               | Computes sine.                                                                               |
| [`sinhf`](/docs/api/c/sinhf)           | Computes hyperbolic sine.                                                                    |
| [`sinh`](/docs/api/c/sinh)             | Computes hyperbolic sine.                                                                    |
| [`sqrtf`](/docs/api/c/sqrtf)           | Computes square root.                                                                        |
| [`sqrt`](/docs/api/c/sqrt)             | Computes square root.                                                                        |
| [`tanf`](/docs/api/c/tanf)             | Computes tangent.                                                                            |
| [`tan`](/docs/api/c/tan)               | Computes tangent.                                                                            |
| [`tanhf`](/docs/api/c/tanhf)           | Computes hyperbolic tangent.                                                                 |
| [`tanh`](/docs/api/c/tanh)             | Computes hyperbolic tangent.                                                                 |
| [`tgammaf`](/docs/api/c/tgammaf)       | Computes gamma function.                                                                     |
| [`tgamma`](/docs/api/c/tgamma)         | Computes gamma function.                                                                     |
| [`truncf`](/docs/api/c/truncf)         | Rounds to nearest integer not greater in magnitude than the given value.                     |
| [`trunc`](/docs/api/c/trunc)           | Rounds to nearest integer not greater in magnitude than the given value.                     |

## Standard I/O

| Function                           | Description                                                                |
| ---------------------------------- | -------------------------------------------------------------------------- |
| [`clearerr`](/docs/api/c/clearerr) | Clears the end-of-file and error indicators for the given stream.          |
| [`fclose`](/docs/api/c/fclose)     | Closes the given file stream.                                              |
| [`feof`](/docs/api/c/feof)         | Checks if the end-of-file indicator is set for the given stream.           |
| [`ferror`](/docs/api/c/ferror)     | Checks if the error indicator is set for the given stream.                 |
| [`fflush`](/docs/api/c/fflush)     | Writes any unwritten data from the stream's buffer to the file.            |
| [`fgetc`](/docs/api/c/fgetc)       | Reads the next character from the given stream.                            |
| [`fgetpos`](/docs/api/c/fgetpos)   | Gets the current file position of the stream.                              |
| [`fgets`](/docs/api/c/fgets)       | Reads at most count-1 characters from the stream into a string.            |
| [`fopen`](/docs/api/c/fopen)       | Opens a file indicated by filename with the given mode.                    |
| [`fprintf`](/docs/api/c/fprintf)   | Prints formatted output to a file stream.                                  |
| [`fputc`](/docs/api/c/fputc)       | Writes a character to the given stream.                                    |
| [`fputs`](/docs/api/c/fputs)       | Writes a string to the given stream.                                       |
| [`fread`](/docs/api/c/fread)       | Reads up to count objects of the given size from the stream into a buffer. |
| [`freopen`](/docs/api/c/freopen)   | Reopens a stream with a different file or mode.                            |
| [`fscanf`](/docs/api/c/fscanf)     | Reads formatted input from a file stream.                                  |
| [`fseek`](/docs/api/c/fseek)       | Sets the file position indicator for the stream.                           |
| [`fsetpos`](/docs/api/c/fsetpos)   | Sets the file position of the stream to the given position.                |
| [`ftell`](/docs/api/c/ftell)       | Returns the current file position of the stream.                           |
| [`fwrite`](/docs/api/c/fwrite)     | Writes count objects of the given size from a buffer to the stream.        |
| [`getc`](/docs/api/c/getc)         | Reads the next character from the given stream.                            |
| [`getchar`](/docs/api/c/getchar)   | Reads the next character from stdin.                                       |
| [`perror`](/docs/api/c/perror)     | Prints an error message describing the last error to stderr.               |
| [`printf`](/docs/api/c/printf)     | Prints formatted output to stdout.                                         |
| [`putc`](/docs/api/c/putc)         | Writes a character to the given stream.                                    |
| [`putchar`](/docs/api/c/putchar)   | Writes a character to stdout.                                              |
| [`puts`](/docs/api/c/puts)         | Writes a string followed by a newline to stdout.                           |
| [`remove`](/docs/api/c/remove)     | Deletes the file identified by the given path.                             |
| [`rename`](/docs/api/c/rename)     | Renames a file, moving it if necessary.                                    |
| [`rewind`](/docs/api/c/rewind)     | Moves the file position indicator to the beginning of the stream.          |
| [`scanf`](/docs/api/c/scanf)       | Reads formatted input from stdin.                                          |
| [`setbuf`](/docs/api/c/setbuf)     | Sets the buffer to be used by the given stream.                            |
| [`setvbuf`](/docs/api/c/setvbuf)   | Sets the buffering mode and buffer to be used by the given stream.         |
| [`sprintf`](/docs/api/c/sprintf)   | Prints formatted output to a string.                                       |
| [`sscanf`](/docs/api/c/sscanf)     | Reads formatted input from a string.                                       |
| [`tmpfile`](/docs/api/c/tmpfile)   | Creates and opens a temporary file with a unique name.                     |
| [`tmpnam`](/docs/api/c/tmpnam)     | Generates a unique filename that does not name an existing file.           |
| [`ungetc`](/docs/api/c/ungetc)     | Puts a character back into the given stream.                               |

## Standard library

| Function                         | Description                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------- |
| [`abort`](/docs/api/c/abort)     | Causes abnormal program termination without cleaning up.                      |
| [`abs`](/docs/api/c/abs)         | Computes the absolute value of an integer value.                              |
| [`atof`](/docs/api/c/atof)       | Converts a byte string to a floating point value.                             |
| [`atoi`](/docs/api/c/atoi)       | Converts a byte string to an integer value.                                   |
| [`atol`](/docs/api/c/atol)       | Converts a byte string to a long integer value.                               |
| [`atoll`](/docs/api/c/atoll)     | Converts a byte string to a long long integer value.                          |
| [`calloc`](/docs/api/c/calloc)   | Allocates memory for an array of num objects of size and zero-initializes it. |
| [`exit`](/docs/api/c/exit)       | Causes normal program termination with cleanup.                               |
| [`free`](/docs/api/c/free)       | Deallocates the memory previously allocated by malloc, calloc or realloc.     |
| [`getenv`](/docs/api/c/getenv)   | Returns the value of an environment variable.                                 |
| [`labs`](/docs/api/c/labs)       | Computes the absolute value of a long integer value.                          |
| [`llabs`](/docs/api/c/llabs)     | Computes the absolute value of a long long integer value.                     |
| [`malloc`](/docs/api/c/malloc)   | Allocates size bytes of uninitialized memory.                                 |
| [`rand`](/docs/api/c/rand)       | Returns a pseudo-random integer value between 0 and RAND_MAX.                 |
| [`realloc`](/docs/api/c/realloc) | Changes the size of the memory block pointed to by ptr to size bytes.         |
| [`srand`](/docs/api/c/srand)     | Seeds the pseudo-random number generator used by rand.                        |
| [`system`](/docs/api/c/system)   | Calls the host environment's command processor.                               |

## Time

| Function                             | Description                                                              |
| ------------------------------------ | ------------------------------------------------------------------------ |
| [`asctime`](/docs/api/c/asctime)     | Converts a tm object to a textual representation.                        |
| [`clock`](/docs/api/c/clock)         | Returns the approximate processor time used by the program.              |
| [`ctime`](/docs/api/c/ctime)         | Converts a time_t object to a textual representation.                    |
| [`difftime`](/docs/api/c/difftime)   | Computes the difference in seconds between two calendar times.           |
| [`gmtime`](/docs/api/c/gmtime)       | Converts a time_t object to calendar time expressed as UTC.              |
| [`localtime`](/docs/api/c/localtime) | Converts a time_t object to calendar time expressed as local time.       |
| [`mktime`](/docs/api/c/mktime)       | Converts calendar time to a time_t object, normalizing the tm structure. |
| [`strftime`](/docs/api/c/strftime)   | Converts a tm object to a custom textual representation.                 |
| [`time`](/docs/api/c/time)           | Returns the current calendar time since the epoch.                       |
