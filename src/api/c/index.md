# C Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

Thin bindings to the platform C standard library for Rux programs.

**Package:** `C`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/C](https://github.com/rux-lang/Rux/tree/main/Packages/C)

The package links the platform C library through `#Link` and exposes its functions directly — the math library (`libm`), standard I/O, the general utilities, and the time functions. Each entry is a 1:1 binding to the C function of the same name, so the authoritative behavior is the C standard and the linked reference on every page.

## Requirements

- A target with a C standard library — every supported OS (BSD, Linux, macOS, Windows) ships one, selected automatically per target.

Each function follows the C calling convention and the C contract exactly: no argument checking, no errno decoding, and no memory management beyond what the C function itself does. Prefer the cross-platform packages ([`Math`](/api/math/), [`Io`](/api/io/), [`Memory`](/api/memory/)) for portable application code, and reach for these bindings when you need the C library specifically.

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

| Type                    | Description                                        |
| ----------------------- | -------------------------------------------------- |
| [`time_t`](types)       | Arithmetic type representing a calendar time.      |
| [`clock_t`](types)      | Arithmetic type representing processor time.       |
| [`tm`](types)           | Calendar time broken into its components.          |
| [`timespec`](types)     | A time in seconds and nanoseconds.                 |


## Math

| Function | Description |
| -------- | ----------- |
| [`acosf`](acosf) | Computes arc cosine. |
| [`acos`](acos) | Computes arc cosine. |
| [`acoshf`](acoshf) | Computes inverse hyperbolic cosine. |
| [`acosh`](acosh) | Computes inverse hyperbolic cosine. |
| [`asinf`](asinf) | Computes arc sine. |
| [`asin`](asin) | Computes arc sine. |
| [`asinhf`](asinhf) | Computes inverse hyperbolic sine. |
| [`asinh`](asinh) | Computes inverse hyperbolic sine. |
| [`atanf`](atanf) | Computes arc tangent. |
| [`atan`](atan) | Computes arc tangent. |
| [`atan2f`](atan2f) | Computes arc tangent, using signs to determine quadrants. |
| [`atan2`](atan2) | Computes arc tangent, using signs to determine quadrants. |
| [`atanhf`](atanhf) | Computes inverse hyperbolic tangent. |
| [`atanh`](atanh) | Computes inverse hyperbolic tangent. |
| [`cbrtf`](cbrtf) | Computes cube root. |
| [`cbrt`](cbrt) | Computes cube root. |
| [`ceilf`](ceilf) | Computes smallest integer not less than the given value. |
| [`ceil`](ceil) | Computes smallest integer not less than the given value. |
| [`copysignf`](copysignf) | Copies the sign of a floating-point value. |
| [`copysign`](copysign) | Copies the sign of a floating-point value. |
| [`cosf`](cosf) | Computes cosine. |
| [`cos`](cos) | Computes cosine. |
| [`coshf`](coshf) | Computes hyperbolic cosine. |
| [`cosh`](cosh) | Computes hyperbolic cosine. |
| [`erff`](erff) | Computes error function. |
| [`erf`](erf) | Computes error function. |
| [`erfcf`](erfcf) | Computes complementary error function. |
| [`erfc`](erfc) | Computes complementary error function. |
| [`expf`](expf) | Computes e raised to the given power. |
| [`exp`](exp) | Computes e raised to the given power. |
| [`exp2f`](exp2f) | Computes 2 raised to the given power. |
| [`exp2`](exp2) | Computes 2 raised to the given power. |
| [`expm1f`](expm1f) | Computes e raised to the given power, minus one. |
| [`expm1`](expm1) | Computes e raised to the given power, minus one. |
| [`fabs`](fabs) | Computes the absolute value of a floating-point value. |
| [`fdimf`](fdimf) | Computes positive difference of two floating-point values. |
| [`fdim`](fdim) | Computes positive difference of two floating-point values. |
| [`floorf`](floorf) | Computes largest integer not greater than the given value. |
| [`floor`](floor) | Computes largest integer not greater than the given value. |
| [`fmaf`](fmaf) | Computes fused multiply-add. |
| [`fma`](fma) | Computes fused multiply-add. |
| [`fmaxf`](fmaxf) | Computes larger of two floating-point values. |
| [`fmax`](fmax) | Computes larger of two floating-point values. |
| [`fminf`](fminf) | Computes smaller of two floating-point values. |
| [`fmin`](fmin) | Computes smaller of two floating-point values. |
| [`fmodf`](fmodf) | Computes remainder of the floating-point division operation. |
| [`fmod`](fmod) | Computes remainder of the floating-point division operation. |
| [`frexp`](frexp) | Decomposes a number into significand and a power of two. |
| [`hypot`](hypot) | Computes square root of the sum of the squares of two given numbers. |
| [`ilogbf`](ilogbf) | Extracts exponent of the number. |
| [`ilogb`](ilogb) | Extracts exponent of the number. |
| [`ldexp`](ldexp) | Multiplies a number by 2 raised to an integer power. |
| [`lgammaf`](lgammaf) | Computes natural logarithm of the absolute value of the gamma function. |
| [`lgamma`](lgamma) | Computes natural logarithm of the absolute value of the gamma function. |
| [`llrintf`](llrintf) | Rounds to nearest integer using current rounding mode. |
| [`llrint`](llrint) | Rounds to nearest integer using current rounding mode. |
| [`llroundf`](llroundf) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`llround`](llround) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`logf`](logf) | Computes natural (base e) logarithm. |
| [`log`](log) | Computes natural (base e) logarithm. |
| [`log10f`](log10f) | Computes common (base 10) logarithm. |
| [`log10`](log10) | Computes common (base 10) logarithm. |
| [`log1pf`](log1pf) | Computes natural logarithm of 1 plus the given number. |
| [`log1p`](log1p) | Computes natural logarithm of 1 plus the given number. |
| [`log2f`](log2f) | Computes base 2 logarithm. |
| [`log2`](log2) | Computes base 2 logarithm. |
| [`logbf`](logbf) | Extracts exponent of the number. |
| [`logb`](logb) | Extracts exponent of the number. |
| [`lrintf`](lrintf) | Rounds to nearest integer using current rounding mode. |
| [`lrint`](lrint) | Rounds to nearest integer using current rounding mode. |
| [`lroundf`](lroundf) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`lround`](lround) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`modff`](modff) | Decomposes a number into integer and fractional parts. |
| [`modf`](modf) | Decomposes a number into integer and fractional parts. |
| [`nanf`](nanf) | Generates a quiet NaN. |
| [`nan`](nan) | Generates a quiet NaN. |
| [`nearbyintf`](nearbyintf) | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nearbyint`](nearbyint) | Rounds to nearest integer using current rounding mode without raising the inexact exception. |
| [`nextafterf`](nextafterf) | Determines next representable floating-point value toward the given value. |
| [`nextafter`](nextafter) | Determines next representable floating-point value toward the given value. |
| [`powf`](powf) | Computes a number raised to the given power. |
| [`pow`](pow) | Computes a number raised to the given power. |
| [`remainderf`](remainderf) | Computes signed remainder of the floating-point division operation. |
| [`remainder`](remainder) | Computes signed remainder of the floating-point division operation. |
| [`remquof`](remquof) | Computes signed remainder as well as the three last bits of the division operation. |
| [`remquo`](remquo) | Computes signed remainder as well as the three last bits of the division operation. |
| [`rintf`](rintf) | Rounds to nearest integer using current rounding mode. |
| [`rint`](rint) | Rounds to nearest integer using current rounding mode. |
| [`roundf`](roundf) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`round`](round) | Rounds to nearest integer, rounding away from zero in halfway cases. |
| [`scalbnf`](scalbnf) | Multiplies a number by FLT_RADIX raised to an integer power. |
| [`scalbn`](scalbn) | Multiplies a number by FLT_RADIX raised to an integer power. |
| [`sinf`](sinf) | Computes sine. |
| [`sin`](sin) | Computes sine. |
| [`sinhf`](sinhf) | Computes hyperbolic sine. |
| [`sinh`](sinh) | Computes hyperbolic sine. |
| [`sqrtf`](sqrtf) | Computes square root. |
| [`sqrt`](sqrt) | Computes square root. |
| [`tanf`](tanf) | Computes tangent. |
| [`tan`](tan) | Computes tangent. |
| [`tanhf`](tanhf) | Computes hyperbolic tangent. |
| [`tanh`](tanh) | Computes hyperbolic tangent. |
| [`tgammaf`](tgammaf) | Computes gamma function. |
| [`tgamma`](tgamma) | Computes gamma function. |
| [`truncf`](truncf) | Rounds to nearest integer not greater in magnitude than the given value. |
| [`trunc`](trunc) | Rounds to nearest integer not greater in magnitude than the given value. |


## Standard I/O

| Function | Description |
| -------- | ----------- |
| [`clearerr`](clearerr) | Clears the end-of-file and error indicators for the given stream. |
| [`fclose`](fclose) | Closes the given file stream. |
| [`feof`](feof) | Checks if the end-of-file indicator is set for the given stream. |
| [`ferror`](ferror) | Checks if the error indicator is set for the given stream. |
| [`fflush`](fflush) | Writes any unwritten data from the stream's buffer to the file. |
| [`fgetc`](fgetc) | Reads the next character from the given stream. |
| [`fgetpos`](fgetpos) | Gets the current file position of the stream. |
| [`fgets`](fgets) | Reads at most count-1 characters from the stream into a string. |
| [`fopen`](fopen) | Opens a file indicated by filename with the given mode. |
| [`fprintf`](fprintf) | Prints formatted output to a file stream. |
| [`fputc`](fputc) | Writes a character to the given stream. |
| [`fputs`](fputs) | Writes a string to the given stream. |
| [`fread`](fread) | Reads up to count objects of the given size from the stream into a buffer. |
| [`freopen`](freopen) | Reopens a stream with a different file or mode. |
| [`fscanf`](fscanf) | Reads formatted input from a file stream. |
| [`fseek`](fseek) | Sets the file position indicator for the stream. |
| [`fsetpos`](fsetpos) | Sets the file position of the stream to the given position. |
| [`ftell`](ftell) | Returns the current file position of the stream. |
| [`fwrite`](fwrite) | Writes count objects of the given size from a buffer to the stream. |
| [`getc`](getc) | Reads the next character from the given stream. |
| [`getchar`](getchar) | Reads the next character from stdin. |
| [`perror`](perror) | Prints an error message describing the last error to stderr. |
| [`printf`](printf) | Prints formatted output to stdout. |
| [`putc`](putc) | Writes a character to the given stream. |
| [`putchar`](putchar) | Writes a character to stdout. |
| [`puts`](puts) | Writes a string followed by a newline to stdout. |
| [`remove`](remove) | Deletes the file identified by the given path. |
| [`rename`](rename) | Renames a file, moving it if necessary. |
| [`rewind`](rewind) | Moves the file position indicator to the beginning of the stream. |
| [`scanf`](scanf) | Reads formatted input from stdin. |
| [`setbuf`](setbuf) | Sets the buffer to be used by the given stream. |
| [`setvbuf`](setvbuf) | Sets the buffering mode and buffer to be used by the given stream. |
| [`sprintf`](sprintf) | Prints formatted output to a string. |
| [`sscanf`](sscanf) | Reads formatted input from a string. |
| [`tmpfile`](tmpfile) | Creates and opens a temporary file with a unique name. |
| [`tmpnam`](tmpnam) | Generates a unique filename that does not name an existing file. |
| [`ungetc`](ungetc) | Puts a character back into the given stream. |


## Standard library

| Function | Description |
| -------- | ----------- |
| [`abort`](abort) | Causes abnormal program termination without cleaning up. |
| [`abs`](abs) | Computes the absolute value of an integer value. |
| [`atof`](atof) | Converts a byte string to a floating point value. |
| [`atoi`](atoi) | Converts a byte string to an integer value. |
| [`atol`](atol) | Converts a byte string to a long integer value. |
| [`atoll`](atoll) | Converts a byte string to a long long integer value. |
| [`calloc`](calloc) | Allocates memory for an array of num objects of size and zero-initializes it. |
| [`exit`](exit) | Causes normal program termination with cleanup. |
| [`free`](free) | Deallocates the memory previously allocated by malloc, calloc or realloc. |
| [`getenv`](getenv) | Returns the value of an environment variable. |
| [`labs`](labs) | Computes the absolute value of a long integer value. |
| [`llabs`](llabs) | Computes the absolute value of a long long integer value. |
| [`malloc`](malloc) | Allocates size bytes of uninitialized memory. |
| [`rand`](rand) | Returns a pseudo-random integer value between 0 and RAND_MAX. |
| [`realloc`](realloc) | Changes the size of the memory block pointed to by ptr to size bytes. |
| [`srand`](srand) | Seeds the pseudo-random number generator used by rand. |
| [`system`](system) | Calls the host environment's command processor. |


## Time

| Function | Description |
| -------- | ----------- |
| [`asctime`](asctime) | Converts a tm object to a textual representation. |
| [`clock`](clock) | Returns the approximate processor time used by the program. |
| [`ctime`](ctime) | Converts a time_t object to a textual representation. |
| [`difftime`](difftime) | Computes the difference in seconds between two calendar times. |
| [`gmtime`](gmtime) | Converts a time_t object to calendar time expressed as UTC. |
| [`localtime`](localtime) | Converts a time_t object to calendar time expressed as local time. |
| [`mktime`](mktime) | Converts calendar time to a time_t object, normalizing the tm structure. |
| [`strftime`](strftime) | Converts a tm object to a custom textual representation. |
| [`time`](time) | Returns the current calendar time since the epoch. |
