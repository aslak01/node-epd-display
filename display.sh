#!/bin/env bash
source "$HOME/.bashrc"
log_with_date() {
  local log_file="$1"
  local input
  if read -rt 1 input; then
    {
      echo "$input"
      cat
      date
    } >>"$log_file"
  fi
}

cd "$HOME/node-epd-display" || return

npm run display 2> >(log_with_date "$HOME/node-epd-display/error.log")
