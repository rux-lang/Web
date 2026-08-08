---
title: Terms of Use
description: The terms that apply to the Rux website, the package registry, and the playground — what you may publish, what happens to it, and what is not permitted.
seo:
  title: Terms of Use
  description: The terms that apply to the Rux website, the package registry, and the playground — what you may publish, what happens to it, and what is not permitted.
  ogType: website
  ogUrl: https://rux-lang.dev/terms
---

# Terms of Use

_Last updated: 7 August 2026_

These terms apply to the website at `rux-lang.dev`, the [package registry](/packages) and its API, and
the [playground](/play). By using them you agree to them. If you do not, please do not use the
services.

The Rux compiler and toolchain are separate: they are distributed under the
[MIT License](https://github.com/rux-lang/Rux/blob/main/LICENSE.md), and that licence governs your use
of the software itself.

## Using the services

Reading the documentation and browsing, searching, and downloading packages needs no account. Publishing
requires a registry account and an [API token](/docs/packaging/tokens).

You are responsible for keeping your account and your tokens secure. Anything done with your credentials
is treated as done by you. Revoke a token as soon as you suspect it has leaked.

You must be able to form a binding agreement to use the registry. The registry is not directed at
children under 16.

## Publishing packages

When you publish a package you confirm that:

- you have the right to publish it, and to grant the licence below;
- it does not infringe anyone's copyright, trademark, patent, or other rights;
- it does not contain malicious code, and does not attempt to compromise the machines that build or run
  it; and
- it does not contain other people's secrets, credentials, or personal data.

You keep ownership of what you publish. You grant the Rux project a non-exclusive, worldwide, royalty-free
licence to store, reproduce, and distribute it, and to display its metadata, README, and licence text on
the registry — for as long as it remains published. That licence exists so the registry can serve your
package to the people who depend on it; it does not give us ownership.

Publish under a licence that lets other people actually use the package. Set `License` or `LicenseFile`
in your [manifest](/docs/packaging/manifest).

## Publication is permanent

**A published version is immutable and cannot be edited, replaced, or deleted.** Other people's builds
depend on that being true.

[Yanking](/docs/packaging/yanking) withdraws a version from new dependency resolution but leaves it
downloadable, so existing builds keep working. It is not deletion, and it is not a way to take back
something that should not have been published.

We may remove content only where we are required to — for example a valid legal demand, an infringement
claim, malware, or leaked credentials — and we will avoid breaking dependent builds where we can. If you
publish a secret by mistake, rotate it immediately; withdrawing the package does not un-publish the
bytes.

## Namespaces

Claiming a [namespace](/docs/packaging/namespaces) makes you responsible for what is published under it.
Namespaces are allocated first come, first served, on the understanding that you intend to use them.

We may reclaim or block a namespace or package name that is used to squat, to impersonate a person or
organisation, or to typosquat an existing package. Where a name is genuinely disputed, we will look at
who is actually using it and act in the interest of the people who depend on it.

## Acceptable use

Do not:

- publish or run malicious, deceptive, or unlawful content;
- attempt to gain unauthorized access to any account, namespace, or system;
- circumvent rate limits, quotas, or the playground sandbox;
- use the services to attack a third party, or to store or distribute unrelated data; or
- scrape or automate in a way that degrades the service for others.

The [Code of Conduct](/code-of-conduct) applies to everything you publish and to every interaction in
the project's spaces.

To report a security problem, follow the [security policy](/security). Do not open a public issue.

## The playground

The playground compiles and runs submitted code in a sandboxed, throwaway container with time, memory,
and size limits. It is provided for experimentation only.

Nothing you run is stored, so treat every run as ephemeral, and do not paste secrets into it. Do not use
it for sustained computation, or to attempt to reach anything outside its sandbox.

## Availability and warranty

The services are provided **as is**, without warranty of any kind. We do not guarantee that the
registry, the API, or the playground will be available, uninterrupted, or free of errors, and we may
change or discontinue any part of them.

To the fullest extent permitted by law, the Rux maintainers and contributors are not liable for any
indirect, incidental, or consequential loss arising from your use of the services — including lost data,
lost profits, or a broken build.

Nothing here limits liability that cannot be limited by law.

## Suspension

We may suspend or terminate an account, a token, or access to a namespace that breaches these terms or
the Code of Conduct, or where we are required to. Where it is reasonable to do so, we will say why.

## Changes

We will update this page when the terms change, and change the date at the top. Material changes will
also be noted on the [blog](/blog). Continuing to use the services after a change means you accept it.

## Contact

[info@rux-lang.dev](mailto:info@rux-lang.dev)
