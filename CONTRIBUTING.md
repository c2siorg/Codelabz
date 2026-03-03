# Contributing to Codelabz

Thank you for considering contributing to Codelabz! We value your time and effort. The following guidelines will help you contribute effectively and collaboratively.

> **Looking for setup instructions?** See [INSTALLATION.md](INSTALLATION.md).
> 
> **Note:** For detailed background and rationale behind these processes, see the [Contribution Guidelines discussion (#284)](https://github.com/c2siorg/Codelabz/issues/284).

---

## Table of Contents

- [Code of Conduct](#1-code-of-conduct)
- [Project Governance & Branching Strategy](#2-project-governance--branching-strategy)
- [Finding an Issue to Work On](#3-finding-an-issue-to-work-on)
- [Contribution Workflow](#4-contribution-workflow)
- [Branch Naming Conventions](#5-branch-naming-conventions)
- [Commit Message Guidelines](#6-commit-message-guidelines)
- [Pull Request Guidelines](#7-pull-request-guidelines)
- [Review Process & Expectations](#8-review-process--expectations)
- [Inactivity & Reassignment Policy](#9-inactivity--reassignment-policy)
- [Common Reasons PRs Are Closed or Skipped](#10-common-reasons-prs-are-closed-or-skipped)
- [Questions & Discussions](#11-questions--discussions)

---

## 1. Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

We are committed to maintaining a respectful, inclusive, and collaborative environment. Unacceptable behavior will not be tolerated.

## 2. Project Governance & Branching Strategy

To maintain stability and production safety, Codelabz follows a strict branching model:

| Branch    | Purpose                                                        |
| --------- | -------------------------------------------------------------- |
| `develop` | Active development. All features, fixes, and contributor PRs **must target this branch**. |
| `main`    | Production-ready. Reserved for stable releases and deployment. |

> Pull Requests opened against `main` will be requested to retarget `develop`.

## 3. Finding an Issue to Work On

Before starting any work:

- Check [existing issues](https://github.com/c2siorg/Codelabz/issues) to avoid duplication.
- Look for issues with these labels:
  - `good first issue`
  - `help wanted`
  - `bug`
  - `feature`
- Discuss ideas in [GitHub Discussions](https://github.com/c2siorg/Codelabz/discussions) or in the issue comments.

**Do not start working on an issue without being officially assigned.**

## 4. Contribution Workflow

We follow a structured process to ensure fairness and quality:

### Step 1 — Discuss

Discuss your idea or confirm the issue scope in [Discussions](https://github.com/c2siorg/Codelabz/discussions) or issue comments.

### Step 2 — Assignment

- Comment on the issue requesting assignment.
- Issues are assigned on a **First-Come, First-Served (FCFS)** basis.
- Only assigned contributors may submit PRs for that issue.

### Step 3 — Development

1. Fork the repository.
2. Create a new branch from `develop` (see [naming conventions](#5-branch-naming-conventions)).
3. Keep your branch up-to-date with `develop`.

### Step 4 — Prepare Your Pull Request

Before opening a PR, ensure:

- [x] Your branch is rebased or merged with the latest `develop`.
- [x] No merge conflicts remain.
- [x] All CI checks pass (`npm run lint`, `npm run build`).
- [x] Code follows project style (`npm run format`).
- [x] Relevant tests are added or updated (`npm run cy:run`).
- [x] The PR is linked to the assigned issue.

> **Tip:** You are encouraged to open a **Draft PR** early for feedback before finalizing your implementation.

## 5. Branch Naming Conventions

Branches must follow this format:

| Prefix       | Use Case                          | Example                          |
| ------------ | --------------------------------- | -------------------------------- |
| `feature/`   | New features                      | `feature/user-dashboard`         |
| `fix/`       | Bug fixes                         | `fix/login-validation-error`     |
| `docs/`      | Documentation updates             | `docs/update-contributing-guide` |
| `chore/`     | Maintenance and housekeeping      | `chore/update-dependencies`      |

Keep names short, lowercase, and hyphen-separated.

## 6. Commit Message Guidelines

Follow professional commit conventions:

- **Use imperative tense:**
  - Example: `Add user authentication`
- Keep the first line concise (50–72 characters recommended).
- Add context in the body if necessary.
- Reference related issue numbers:
  - `Closes #123`
  - `Fixes #456`
- **Avoid vague messages** like `update`, `changes`, or `fix stuff`.

## 7. Pull Request Guidelines

Each Pull Request should:

- Address **one issue only**.
- Be focused and minimal — avoid unrelated changes.
- Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely, including:
  - **What** was changed
  - **Why** it was changed
  - **How** it was tested
- Include **screenshots** for UI changes.
- Include **reproduction steps** for bug fixes.

**Link your PR to the relevant issue using [GitHub closing keywords](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests) (e.g., `Closes #123`, `Fixes #456`). This ensures the issue is automatically closed when your PR is merged.**

### PR Checklist

Before submitting, confirm:

- [ ] Target branch is `develop`
- [ ] Linked to assigned issue
- [ ] CI checks passing (`npm run lint`, `npm run build`)
- [ ] No merge conflicts
- [ ] Tests added or updated (if applicable)
- [ ] No unrelated changes included

## 8. Review Process & Expectations

Code review is collaborative, not adversarial. Please:

- Be respectful and professional.
- Address **all** review comments before requesting re-review.
- Avoid introducing new, unrelated changes during review.
- Keep discussions technical and constructive.
- Be mindful of reviewers' time.

Maintainers may request changes before approval.

## 9. Inactivity & Reassignment Policy

To keep the project moving:

- If no meaningful progress is shown within **7 days**, the issue may be reassigned.
- Issues with no activity for **30 days** are automatically marked as stale, and closed after **14 additional days** of inactivity.
- If you need more time, **communicate clearly** in the issue thread.

## 10. Common Reasons PRs Are Closed or Skipped

To avoid delays, ensure your PR does not fall into these pitfalls:

- PR targets `main` instead of `develop`.
- Contributor was not assigned to the issue.
- PR not linked to any issue.
- CI, lint, or build failures.
- Large, unfocused PRs spanning multiple unrelated issues.
- Unaddressed review comments.
- Duplicate work or work started without prior discussion.

## 11. Questions & Discussions

We welcome ideas and improvements. For feature proposals or structural changes:

1. Start a [GitHub Discussion](https://github.com/c2siorg/Codelabz/discussions) first.
2. Align with maintainers before implementation begins.

This ensures clarity and prevents wasted effort.

---

*Following these guidelines ensures fair contribution distribution, a stable development workflow, and high code quality. Thank you for helping improve Codelabz!*
