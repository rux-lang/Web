# Statements

Statements control the flow of execution. Two rules hold across every kind:

- A condition is **never parenthesised** — write `if x > 0`, not `if (x > 0)`.
- Every body is a **block in braces**, even when it contains a single statement.

A condition is always a [`bool`](/docs/boolean/bool); Rux does not treat numbers or pointers as truthy, so compare explicitly (`if count != 0`, not `if count`).

## Conditionals

| Statement                                | Description                          |
| ---------------------------------------- | ------------------------------------ |
| [`if` / `else`](/docs/statements/if)     | Branch on Boolean conditions         |
| [`match`](/docs/statements/match)        | Exhaustive pattern matching          |

## Loops

| Statement                                | Description                          |
| ---------------------------------------- | ------------------------------------ |
| [`while`](/docs/statements/while)        | Loop while a condition holds         |
| [`for` / `in`](/docs/statements/for)     | Iterate over a collection or range   |
| [`loop`](/docs/statements/loop)          | Unconditional infinite loop          |

## Loop Control

| Statement                                                | Description                  |
| -------------------------------------------------------- | ---------------------------- |
| [`break` / `continue`](/docs/statements/break-continue)  | Alter loop control flow      |
