#!/usr/bin/env bash
# Stash local changes, pull --rebase, push, then restore stash.
set -e
cd "$(git rev-parse --show-toplevel)"

STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo ">>> git stash push (save local changes)"
  git stash push -m "fix-push"
  STASHED=1
fi

echo ">>> git pull --rebase origin main"
git pull --rebase origin main

echo ">>> git push origin main"
git push origin main

if [ "$STASHED" = 1 ]; then
  echo ">>> git stash pop (restore local changes)"
  git stash pop
fi

echo ">>> Done."
