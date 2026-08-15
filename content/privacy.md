---
title: Privacy Policy
description: What rux-lang.dev, the package registry, and the playground collect, why, and how long it is kept. Cookieless analytics, no cross-site tracking, no advertising.
seo:
  title: Privacy Policy
  description: What rux-lang.dev, the package registry, and the playground collect, why, and how long it is kept. Cookieless analytics, no cross-site tracking, no advertising.
  ogType: website
  ogUrl: https://rux-lang.dev/privacy
---

# Privacy Policy

_Last updated: 14 August 2026_

This policy explains what data the Rux project collects, why, and how long it is kept. It covers the website at `rux-lang.dev`, the [package registry](/packages) and its API at `api.rux-lang.dev`, and the [playground](/play).

Questions about this policy, or a request about your data, go to [info@rux-lang.dev](mailto:info@rux-lang.dev).

## In short

- The documentation site uses **cookieless, privacy-friendly analytics** that build no profile and identify no visitor. There is **no advertising and no cross-site tracking**.
- Reading the documentation, browsing packages, and downloading packages need **no account**.
- The only personal data we hold is what a **registry account** requires, and it comes from GitHub.
- The playground **stores nothing**.
- Published packages are **public and permanent**.

## Browsing the website

The site is a set of static files. It sets no cookies. Fonts are served from our own domain rather than a font CDN.

We measure how the site is used with [Umami](https://umami.is), which loads one script from `cloud.umami.is` and sends its measurements back to the same host. Umami is cookieless: it stores no identifier in your browser and does not follow you across sites, so no consent banner is required. What it records is the page path, the referring page, your screen size, and your browser, operating system and country — aggregated into counts, never into a profile of you. Nothing there is combined with your registry account.

If you would rather not be counted, run `localStorage.setItem('umami.disabled', 1)` in your browser's console; that stores an opt-out flag on this site and stops all further measurement. Blocking `cloud.umami.is` in an extension works just as well, and nothing on the site depends on it loading.

Two things are stored in your own browser, never sent to us as a profile:

| Stored                | Where            | Purpose                                                                      |
| --------------------- | ---------------- | ---------------------------------------------------------------------------- |
| Light/dark preference | `localStorage`   | Remembering the theme you chose                                              |
| `rux.auth.return`     | `sessionStorage` | The page to return to after signing in; expires in 10 minutes                |
| `rux.auth.session`    | `sessionStorage` | Session expiry only, so "signed out" and "session expired" can be told apart |

You can clear these at any time through your browser; nothing on the site depends on them.

The site is hosted on **Cloudflare Pages**. Like any web host, Cloudflare processes the network requests needed to serve pages, subject to its own terms.

## Signing in to the registry

Signing in is optional and only needed to publish or manage packages. It uses **GitHub OAuth**: you authorize the Rux registry on GitHub, and GitHub returns your identity to us. We store:

- your numeric GitHub user ID and login;
- your display name and avatar URL, if your GitHub profile has them.

We do not receive or store your GitHub password, your email address, or access to your repositories.

While you are signed in, the registry API sets two cookies, `__Host-rux_session` and `__Host-rux_csrf`. Both are strictly necessary for authentication and cross-site request protection. Neither is used for analytics, and there are no other cookies.

Your avatar image is loaded directly from `avatars.githubusercontent.com`. That request goes to GitHub, not to us, so GitHub can see your IP address and browser when it is fetched.

## API tokens

An [API token](/docs/packaging/tokens) lets the `rux` command line publish on your behalf. We store the token's display name, its scopes, its creation, expiry and last-use times, a short non-secret prefix, and a **SHA-256 hash of the credential**. The credential itself is shown once and never stored, so we cannot recover or display it again.

## Publishing and downloading packages

Everything you publish is **public**: the package name, namespace, version, manifest metadata, README, license, and the package archive itself. Published versions are immutable — [yanking](/docs/packaging/yanking) withdraws a version from new resolution but does not delete it. Do not publish anything you are not willing to make permanently public.

The registry records a **download event** for each package download so it can show download counts. Events are counted; they do not identify who downloaded what.

## The playground

Code you run in the [playground](/play) is sent to our API and executed in a throwaway container. The container is destroyed after the run.

**Nothing is stored.** There is no database table for playground runs, no retention period, and no permalinks. Do not paste secrets or personal data into the playground.

## Logs and abuse prevention

To keep the service available we apply rate limits, which derive a short-lived key from the requesting IP address (IPv6 addresses are reduced to their `/64` prefix). That key lives in memory, is pruned regularly, and is not written to logs.

Request logs are deliberately narrow. They record a generated request identifier, the HTTP method, the matched route pattern, the response status, the duration, and tracing identifiers. They do **not** record IP addresses, user agents, raw paths, query strings, request bodies, headers, cookies, or credentials.

Security-relevant account actions — signing in, creating or revoking a token, changing namespace membership, publishing, yanking — are written to an append-only audit record so an account owner can see what happened. Those records hold only safe identifiers and a fixed set of allowed fields; they never contain credentials, cookies, request bodies, IP addresses, or user agents.

## How long data is kept

| Data                   | Kept                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| Published packages     | Indefinitely — publication is permanent                                |
| Account profile        | Until you delete your account                                          |
| Sessions               | Until they expire or you sign out                                      |
| API tokens             | Until they expire or you revoke them; revoked tokens remain as history |
| Audit records          | Indefinitely, as an append-only account history                        |
| Playground runs        | Not stored                                                             |
| Database backups       | Roughly four weeks of point-in-time history                            |
| Deleted stored objects | Retained for 90 days as protection against accidental deletion         |

## Deleting your account

You can delete your registry account from your [dashboard](/packages/-/dashboard/settings). Deletion revokes every session and API token you hold and clears your GitHub identity and profile from our records.

It **anonymizes** rather than erases. Your account row remains, without any identity attached, so that the packages you published stay valid and installable. Publication history is part of the public record and is not removed.

If you are the last owner of a namespace, deletion is refused until you add or promote another owner.

## Your rights

You can ask us to confirm what data we hold about you, correct it, or delete it, and you can obtain a copy of it. Write to [info@rux-lang.dev](mailto:info@rux-lang.dev). Most of it is visible in your [dashboard](/packages/-/dashboard) already, and account deletion is self-service.

The one thing we cannot undo is publication. A published package version is permanent and public.

## Children

The registry is not directed at children under 16, and we do not knowingly collect their data.

## Changes

We will update this page when what we collect changes, and change the date at the top. Material changes will also be noted on the [blog](/blog).

## Contact

[info@rux-lang.dev](mailto:info@rux-lang.dev)
