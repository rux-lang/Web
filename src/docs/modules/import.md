# Import

`import` brings names from a module into the current scope so they can be used without their full path. It comes in three forms:

```rux
import Math::Sqrt;                    // a single name
import Http::{ Request, Response };   // several names from one module
import Std::Io::*;                    // every public name from a module
```

The braced form lists several names from the same module in one statement:

```rux
import Std::Io::{ Print, PrintLine };
```

Without an import, refer to an item by its qualified path using the `::` separator:

```rux
let result = Math::Sqrt(2.0);
```

Only [`pub`](/docs/modules/visibility) items can be imported; private items are not visible outside their module.

## See Also

- [Module Declaration](/docs/modules/declaration) — defining the modules you import from
- [Items Visibility](/docs/modules/visibility) — what `pub` exposes to importers
- [`@[Target]`](/docs/attributes/target) — platform-specific imports
