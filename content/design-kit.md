---
title: Design Kit
description: Download the Rux logo, icon, and avatars, and get the exact brand colors and typefaces used across the Rux language, tooling, and documentation.
navigation:
  icon: i-lucide-palette
# No "On this page" nav — nuxt.com/design-kit has none either. The page is a
# short set of asset grids read top to bottom, not a document to jump around in.
hideToc: true
seo:
  title: Design Kit
  description: Download the Rux logo, icon, and avatars, and get the exact brand colors and typefaces used across the Rux language, tooling, and documentation.
  ogType: website
  ogUrl: https://rux-lang.dev/design-kit
---

# Design Kit

Everything you need to present Rux correctly — the logo in every variant, the
brand colors, and the typefaces. The identity is deliberately plain: one mark,
two accent colors, one type family. Use these files as they are, and Rux will
look the same wherever it appears.

## Logo

The logo is made of two elements: the `R` mark and the `Rux` wordmark. The mark
is a single letterform — a violet bowl over an amber checkerboard leg, the two
halves of the same `R`. In most places the mark and the wordmark appear
together. The mark works on its own as an icon, an avatar, or a badge — but the
wordmark should never appear without the mark beside it.

Pick the variant with the most contrast against your background. On a colored or
photographic background, use the solid white or solid black version rather than
the full-color one.

### Icon

The mark alone, drawn to the edges of a square so it drops into a favicon, a
tile, or a badge without extra padding.

::u-page-grid
:design-kit-image-card{path="icon-color" name="Color"}
:design-kit-image-card{path="icon-black" name="Black" background="bg-white"}
:design-kit-image-card{path="icon-white" name="White" background="bg-mist-900"}
::

### Logo

::u-page-grid
:design-kit-image-card{path="logo-color-white" name="Color & white" background="bg-mist-900" full}
:design-kit-image-card{path="logo-color-black" name="Color & black" background="bg-white" full}
:design-kit-image-card{path="logo-white" name="White" background="bg-mist-900" full}
:design-kit-image-card{path="logo-black" name="Black" background="bg-white" full}
::

### Avatars

Profile pictures are usually cropped to a circle or a rounded square, and most
platforms flatten transparency onto a background you do not control. These three
inset the mark inside a fixed 512 × 512 square so the crop never bites into it —
two with the backdrop baked in, one left transparent for platforms that let you
set your own.

::u-page-grid
:design-kit-image-card{path="avatar-white" name="On white" background="bg-white"}
:design-kit-image-card{path="avatar-mist" name="On mist" background="bg-[#22292b]"}
:design-kit-image-card{path="avatar" name="Transparent"}
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

The palette is built around two accents — violet and amber — kept deliberately
small so that the colors carry meaning wherever they appear. Each accent has a
light and a deep value; the mark runs a top-to-bottom gradient between the two.
Use the values below rather than sampling them from a screenshot.

::u-page-grid
:design-kit-color-card{background="#C4B5FD" name="Violet Light"}
:design-kit-color-card{background="#A78BFA" name="Violet"}
:design-kit-color-card{background="#7C3AED" name="Violet Deep"}
:design-kit-color-card{background="#FDE68A" name="Amber Light"}
:design-kit-color-card{background="#D97706" name="Amber Deep"}
::

Violet is the primary accent — links, active states, the bowl of the mark. Amber
is the secondary, and appears only in the mark's checkerboard leg; it is never a
link or a button color.

::u-page-grid
:design-kit-color-card{background="#22292B" name="Mist"}
:design-kit-color-card{background="#000000" name="Black"}
:design-kit-color-card{background="#FFFFFF" name="White"}
::

Mist is the dark surface, black and white carry the text. Nothing else is part
of the brand.

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
