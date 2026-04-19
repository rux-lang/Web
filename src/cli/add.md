# `rux add`

Add a dependency to the current package.

```sh
rux add [package]
rux add [package]@[version]
```

## Examples

```sh
# Add the latest version of the package
rux add Json

# Add the package with specified version
rux add Math@0.3.1
```

This command updates `Rux.toml` accordingly.
