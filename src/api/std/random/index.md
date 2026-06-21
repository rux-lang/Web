# `Std::Random`

Seeded pseudo-random number generation.

**Module:** `Std::Random`

Each function maps a `seed` to a value in a requested range using an xorshift
mixer. There is no hidden global state.

::: warning
These functions are **deterministic**: the same `seed` always produces the same
result. They are a stateless hash of the seed, not a running sequence. To get
varying values, change the seed each call — for example by seeding from
[`Std::Time::TickMs`](../time/tickms) and advancing it yourself.
:::

```rux
import Std::Random;
import Std::Time;
import Std::Io::PrintLine;

func Main() -> int {
    var seed = Time::TickMs();
    for i in 0..3 {
        seed = seed + 1u64;
        PrintLine(Random::RandomInt(1, 7, seed));   // a die roll
    }
    return 0;
}
```

## Functions

| Function                     | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| [`RandomInt`](randomint)     | Signed integer in `[min, max)` (`int8`…`int64`, `int`).      |
| [`RandomUInt`](randomuint)   | Unsigned integer in `[min, max)` (`uint8`…`uint64`, `uint`). |
| [`RandomFloat`](randomfloat) | Floating-point value in `[min, max]` (`float32`/`float64`).  |
| [`RandomBool`](randombool)   | A random `true`/`false`.                                     |

All ranged functions require `min < max` and abort via [`Fatal`](../fatal)
otherwise.
