#!/bin/env bash
source "$HOME/.bashrc"
log_with_date() {
  local log_file="$1"
  local input
  if read -t 1 input; then
    {
      echo "$input"
      cat
      date
    } >>"$log_file"
  fi
}

cd "$HOME/node-epd-display"

npm run display 2> >(log_with_date "$HOME/node-epd-display/error.log")
