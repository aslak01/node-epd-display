#!/bin/env bash
source "$HOME/.bashrc"

cd "$HOME/node-epd-display"

npm run display 2>>"$HOME/node-epd-display/error.log" && date >>"$HOME/node-epd-display/error.log"
