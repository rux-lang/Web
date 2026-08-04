---
title: Design Kit
description: Download the Rux logo, icon, and avatars, and get the exact brand colors and typefaces used across the Rux language, tooling, and documentation.
navigation:
  icon: i-lucide-palette
# No "On this page" nav — nuxt.com/design-kit has none either. The page is a
# short set of asset grids read top to bottom, not a document to jump around in.
hideToc: true
seo:
  title: Rux Design Kit
  description: Download the Rux logo, icon, and avatars, and get the exact brand colors and typefaces used across the Rux language, tooling, and documentation.
  ogType: website
  ogUrl: https://rux-lang.dev/design-kit
---

# Design Kit

Everything you need to present Rux correctly — the logo in every variant, the
brand colors, and the typefaces. The identity is deliberately plain: one mark,
one accent color, one type family. Use these files as they are, and Rux will
look the same wherever it appears.

## Logo

The logo is made of two elements: the omega mark and the `Rux` wordmark. In most
places they appear together. The mark works on its own as an icon, an avatar, or
a badge — but the wordmark should never appear without the mark beside it.

Pick the variant with the most contrast against your background. On a colored or
photographic background, use the solid white or solid black version rather than
the purple one.

### Icon

::u-page-grid
:design-kit-image-card{path="icon-purple" name="Purple"}
:design-kit-image-card{path="icon-black" name="Black" background="bg-white"}
:design-kit-image-card{path="icon-white" name="White" background="bg-zinc-800"}
::

### Logo

::u-page-grid
:design-kit-image-card{path="logo-purple-white" name="Purple & white" background="bg-zinc-800" full}
:design-kit-image-card{path="logo-black" name="Black" background="bg-white" full}
:design-kit-image-card{path="logo-white" name="White" background="bg-zinc-800" full}
:design-kit-image-card{path="logo-purple-black" name="Purple & black" background="bg-white" full}
::

### Avatars

Profile pictures are usually cropped to a circle or a rounded square, and most
platforms flatten transparency onto a background you do not control. These two
export the mark onto a fixed 512 × 512 backdrop instead.

::u-page-grid
:design-kit-image-card{path="icon-purple-white" name="Purple on white" png-only}
:design-kit-image-card{path="icon-purple-zinc" name="Purple on zinc" png-only}
::

### Usage

::caution
Do not redraw, recolor, rotate, stretch, or add effects to the mark, and do not
set the wordmark in a different typeface. Leave clear space around the logo of
at least the height of the `R` in the wordmark, and never render it below 24 px
tall.
::

The Rux name and logo identify the language and the official project. Feel free
to use them to link to Rux, to say your project is written in Rux, or to talk
about it — but not in a way that suggests the Rux project endorses, sponsors, or
maintains what you are building.

## Color Palette

The palette is built around a single accent purple, kept deliberately small so
that the color carries meaning wherever it appears. Use the values below rather
than sampling them from a screenshot.

::u-page-grid
:design-kit-color-card{background="#8E51FF" name="Purple"}
:design-kit-color-card{background="#27272A" name="Zinc"}
:design-kit-color-card{background="#000000" name="Black"}
:design-kit-color-card{background="#FFFFFF" name="White"}
::

Purple is the accent — links, active states, the mark itself. Zinc is the dark
surface, black and white carry the text. Nothing else is part of the brand.

## Typography

Rux uses [Geist](https://vercel.com/font) throughout, in two widths: the
proportional face for prose and interface text, and the monospaced face for code,
file paths, and terminal output. Both are variable fonts licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org), so they are free to
redistribute with your own materials.

::u-page-grid
:design-kit-font-card{name="Geist" usage="Headings, body copy, and interface text"}
:design-kit-font-card{name="Geist Mono" usage="Code, file paths, and command output" mono}
::

## Getting the Files

Every logo above downloads as both SVG and PNG — take the SVG unless you need a
raster file, since it stays sharp at any size. If you need a format, a size, or
a lockup that is not here, [open an issue](https://github.com/rux-lang/Web/issues)
and we will add it.
