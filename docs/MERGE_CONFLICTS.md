# Resolving "can't merge into main" conflicts

If GitHub shows **"This branch has conflicts that must be resolved"** (like your screenshot), it means both branches changed the same lines in a file (here: `README.md`).

## Option A: Resolve directly in GitHub UI

1. Open the PR and click **Resolve conflicts**.
2. In the conflict editor, remove conflict markers:
   - `<<<<<<<`
   - `=======`
   - `>>>>>>>`
3. Keep the content you want from both sides.
4. Click **Mark as resolved**.
5. Click **Commit merge**.
6. Return to PR and click **Merge pull request**.

## Option B: Resolve locally (recommended for larger conflicts)

```bash
# 1) Update local refs
git fetch origin

# 2) Checkout your feature branch
git checkout <your-branch>

# 3) Merge main into your branch
git merge origin/main
```

Now resolve conflicts in files (for example `README.md`) and then:

```bash
# 4) Stage conflict resolutions
git add README.md

# 5) Complete merge commit
git commit -m "Resolve merge conflict with main"

# 6) Push updated branch
git push origin <your-branch>
```

GitHub will automatically refresh the PR and allow merge once checks pass.

## Fast strategy for README conflicts

If README keeps conflicting often:

1. Keep README short (high-level only).
2. Move long architecture content into `docs/` files.
3. Link docs from README.

That reduces overlap and makes merges much easier.
