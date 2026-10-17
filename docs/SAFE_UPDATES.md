# Safe dependency updates

## Activation

This pull request prepares checks; it does not activate repository settings.
Protect `main` with a ruleset that requires pull requests, an up-to-date branch, and the following successful checks:

- `Quality checks`
- `Catalog PDF`

Apply the rule to administrators and bots; do not give update bots a bypass. Keep automatic merging disabled during rollout. Check names must match GitHub's displayed names after their first run. A skipped, missing, cancelled, or pending check is not evidence of a passing test.

## Update procedure

Dependabot opens bounded weekly update PRs. Review each update separately, keep the lockfile in the same PR as its manifest, and merge only after the checks pass on the latest revision. Major versions and changes to framework, authentication, payment, database, or deployment packages need explicit review of release notes and affected user journeys. Existing security checks must remain enabled; a vulnerable dependency needs a fix, not an ignored failure.

Before merging, open the hosting preview and verify the home page, navigation, and the site's main user action on desktop and mobile. Use test accounts and test data for any submission. Build and unit checks alone do not prove production integrations work.

## Publication and recovery

Configure the hosting provider to publish production only from the protected branch. Check that native Git integrations and other deploy hooks cannot publish unreviewed branches. After release, verify the production URL and primary user journey. Record the previous working deployment before release; if verification fails, restore that deployment using the host's rollback control, then revert the offending update through a reviewed PR. Database migrations and external side effects need their own recovery plan.

Postdeployment monitoring and automatic rollback are not installed by this PR: they require a verified production URL, health contract, and hosting access.

## Repository-specific notes

The failed catalog job generated the PDF successfully but lost a race while pushing generated files to main. This PR replaces that direct push with an artifact and a draft PR on automation/catalog-update. Publication now requires review and merge of that generated PR. Before merging this workflow change, enable Actions > General > Allow GitHub Actions to create and approve pull requests, or use a suitably scoped GitHub App token. A PR created with the default GITHUB_TOKEN does not automatically trigger ordinary PR workflows: a maintainer must reopen it with their own account (or push a reviewed commit), or configure an App token that triggers CI. Never bypass required checks. The artifact remains available when PR creation is blocked. The Python PDF environment is not fully locked yet; that is a separate reproducibility task.
