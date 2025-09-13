#! /bin/sh

mkdir -p ~/.config/systemd/user

cp ./epd-display@.service ./epd-display@.timer ~/.config/systemd/user

systemctl --user daemon-reload
systemctl --user enable --now "epd-display@$(whoami).timer"
