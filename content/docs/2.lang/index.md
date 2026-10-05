---
title: Rux Language Reference
description: The complete reference for the Rux language as implemented by rux 0.4.0 — lexical structure, types, expressions, functions, data types, optionals, errors, ownership, interfaces, generics, modules, compile-time programming and FFI.
navigation:
  title: Overview
seo:
  title: Rux Reference
  description: The complete reference for the Rux language as implemented by rux 0.4.0 — lexical structure, types, expressions, functions, data types, optionals, errors, ownership, interfaces, generics, modules, compile-time programming and FFI.
  ogImage: https://rux-lang.dev/images/og-docs.png
  ogType: website
  ogUrl: https://rux-lang.dev/docs/lang
---

# Rux Language Reference

This reference describes the Rux language exactly as **rux 0.4.0** implements it: every type, expression, statement and declaration, the rules the compiler enforces and the messages it prints when a rule is broken. Every example on these pages compiles with rux 0.4.0.

It is written for looking things up. To learn the language from the beginning, follow [Learn Rux](/docs/learn) — a course of short, runnable lessons — and come back here for the full rules. The [Introduction](/docs/lang/introduction) explains how the chapters are organised and the grammar notation they use.

## The basics

::u-page-grid
:u-page-card{title="Introduction" description="Design goals, a first program, and how to read this reference." icon="i-lucide-book-open" to="/docs/lang/introduction" variant="subtle"}
:u-page-card{title="Lexical structure" description="Source files, comments, identifiers, keywords, literals and operator tokens." icon="i-lucide-text" to="/docs/lang/lexical/source-files" variant="subtle"}
:u-page-card{title="Types" description="Integers, floating point, booleans, characters, text and type aliases." icon="i-lucide-shapes" to="/docs/lang/types/overview" variant="subtle"}
:u-page-card{title="Bindings" description="let, var and const, initialisation and destructuring." icon="i-lucide-tag" to="/docs/lang/bindings/overview" variant="subtle"}
:u-page-card{title="Expressions" description="Every operator, its precedence, and casts with as." icon="i-lucide-plus" to="/docs/lang/expressions/overview" variant="subtle"}
:u-page-card{title="Statements" description="if, the four loops, labelled break and continue, and return." icon="i-lucide-git-branch" to="/docs/lang/statements/overview" variant="subtle"}
:u-page-card{title="Patterns" description="match, exhaustiveness, and every pattern form." icon="i-lucide-scan-search" to="/docs/lang/patterns/match" variant="subtle"}
::

## Functions and data

::u-page-grid
:u-page-card{title="Functions" description="Declarations, parameters, overloading, function types and Main." icon="i-lucide-square-function" to="/docs/lang/functions/declaration" variant="subtle"}
:u-page-card{title="Structures" description="Structs, methods with typed receivers, constructors and extensions." icon="i-lucide-box" to="/docs/lang/structs/overview" variant="subtle"}
:u-page-card{title="Enumerations" description="Scalar enums with a backing type and explicit values." icon="i-lucide-list-ordered" to="/docs/lang/enums/overview" variant="subtle"}
:u-page-card{title="Variants" description="Tagged unions whose cases carry their own data." icon="i-lucide-split" to="/docs/lang/variants/overview" variant="subtle"}
:u-page-card{title="Unions" description="Untagged overlays of several types in one place." icon="i-lucide-layers" to="/docs/lang/unions/overview" variant="subtle"}
:u-page-card{title="Tuples" description="Anonymous products, the unit type and structural equality." icon="i-lucide-parentheses" to="/docs/lang/tuples/overview" variant="subtle"}
:u-page-card{title="Arrays" description="Fixed-length T[N], repeat literals and bounds checks." icon="i-lucide-brackets" to="/docs/lang/arrays/overview" variant="subtle"}
:u-page-card{title="Slices" description="Read-only T[..] and writable var T[..] views." icon="i-lucide-scissors" to="/docs/lang/slices/overview" variant="subtle"}
:u-page-card{title="Ranges" description="The six range forms and where they are used." icon="i-lucide-move-horizontal" to="/docs/lang/ranges/overview" variant="subtle"}
::

## Absence and failure

::u-page-grid
:u-page-card{title="Optionals" description="T? and none, ?? fallbacks and ? propagation." icon="i-lucide-circle-dashed" to="/docs/lang/optionals/overview" variant="subtle"}
:u-page-card{title="Errors" description="Fallibles T ! E, fail, catch, propagation and panics." icon="i-lucide-triangle-alert" to="/docs/lang/errors/overview" variant="subtle"}
:u-page-card{title="Sum types" description="A | B values, typed patterns and the is test." icon="i-lucide-combine" to="/docs/lang/sums/overview" variant="subtle"}
::

## Memory and ownership

::u-page-grid
:u-page-card{title="References" description="Borrowing with &T and &var T, and the exclusivity rule." icon="i-lucide-link" to="/docs/lang/references/overview" variant="subtle"}
:u-page-card{title="Pointers" description="*T and *var T, @ and *, null, arithmetic and slicing." icon="i-lucide-mouse-pointer-2" to="/docs/lang/pointers/overview" variant="subtle"}
:u-page-card{title="Ownership" description="Copies and moves, destructors and defer." icon="i-lucide-key-round" to="/docs/lang/ownership/overview" variant="subtle"}
:u-page-card{title="Memory layout" description="sizeof, alignof, padding and the layout of native forms." icon="i-lucide-ruler" to="/docs/lang/memory/layout" variant="subtle"}
::

## Abstraction

::u-page-grid
:u-page-card{title="Interfaces" description="Declarations, interface values, core interfaces, operators, indexers and iteration." icon="i-lucide-plug" to="/docs/lang/interfaces/overview" variant="subtle"}
:u-page-card{title="Generics" description="Generic functions, types and methods, and bounds." icon="i-lucide-variable" to="/docs/lang/generics/overview" variant="subtle"}
:u-page-card{title="Modules" description="Packages and modules, imports and pub visibility." icon="i-lucide-package" to="/docs/lang/modules/overview" variant="subtle"}
::

## Compile time and platform

::u-page-grid
:u-page-card{title="Compile time" description="when, the #target, #build, #compiler, #source and #config context, intrinsics and diagnostics." icon="i-lucide-cpu" to="/docs/lang/comptime/overview" variant="subtle"}
:u-page-card{title="Attributes" description="#Link, #Abi, #NoReturn, #Warn, #Error, #Allow and #Format." icon="i-lucide-at-sign" to="/docs/lang/attributes/overview" variant="subtle"}
:u-page-card{title="Foreign Function Interface" description="extern declarations, linking libraries and inline assembly." icon="i-lucide-cable" to="/docs/lang/ffi/overview" variant="subtle"}
::

## Appendix

- [Primitive types](/docs/lang/appendix/primitives) — every primitive type and alias in one table, implemented and reserved.
- [Tokens](/docs/lang/appendix/tokens) — every token the lexer produces.
- [Rux Compiled Unit](/docs/lang/appendix/rcu) — the compiler's native object format.

Package manifests, dependencies and publishing are covered in [Packaging](/docs/packaging), and the standard packages in the [API Reference](/docs/api).
