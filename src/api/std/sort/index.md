# `Std::Sort`

In-place sorting of integer arrays.

**Module:** `Std::Sort`

Sorts a contiguous array in ascending order, given a pointer to its first element
and the element count. Each algorithm comes in an `int` form and a `uint64` form.

```rux
import Algorithms::Sort;
import Io::PrintLine;

func Main() -> int {
    var nums: int[5] = { 5, 2, 8, 1, 9 };
    Sort::Sort(nums.data, nums.length);
    // nums is now { 1, 2, 5, 8, 9 }
    return 0;
}
```

::: warning
The `int` variants compare elements as **unsigned 64-bit** values. Negative
numbers therefore sort _after_ all non-negative numbers (as very large unsigned
values), not before them. For correctly ordered signed data, offset your values
into the non-negative range before sorting, or sort only non-negative data.
:::

## Functions

| Function               | Description                                  |
| ---------------------- | -------------------------------------------- |
| [`Sort`](sort)         | Adaptive sort — the default choice.          |
| [`Quadsort`](quadsort) | Stable merge-based sort.                     |
| [`Piposort`](piposort) | Memory-efficient merge sort variant.         |
| [`Crumsort`](crumsort) | In-place quicksort variant for large inputs. |

Each has a `*int` form (shown above) and a `*uint64` form
(`SortUint64`, `QuadsortUint64`, …) for arrays already typed as `uint64`.
