#!/bin/sh

git shortlog -s -n

git filter-branch -f --commit-filter 'if [ "$GIT_AUTHOR_NAME" = "John Fischer" ];
  then export GIT_AUTHOR_NAME="j1348"; export GIT_AUTHOR_EMAIL="me@jfroffice.me";
  fi; git commit-tree "$@"'
