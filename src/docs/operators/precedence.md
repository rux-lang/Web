# Operator Precedence

From highest to lowest precedence:

| Level       | Operators                                                |
| ----------- | -------------------------------------------------------- |
| 1 (highest) | Unary `!` `~` `-`                                        |
| 2           | `**`                                                     |
| 3           | `*` `/` `%`                                              |
| 4           | `+` `-`                                                  |
| 5           | `<<` `>>`                                                |
| 6           | `&`                                                      |
| 7           | `^`                                                      |
| 8           | `\|`                                                     |
| 9           | `==` `!=` `<` `<=` `>` `>=`                              |
| 10          | `&&`                                                     |
| 11          | `\|\|`                                                   |
| 12          | `as` `is`                                                |
| 13 (lowest) | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` |

Use parentheses to override precedence explicitly.
