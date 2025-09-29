# Systemd Service Setup

This guide shows how to replace the current crontab + display.sh setup with systemd user services.

## Files Created

- `epd-display.service` - Systemd service unit that runs the display command
- `epd-display.timer` - Systemd timer unit that schedules the service every 15 minutes
- `SYSTEMD_SETUP.md` - This setup guide

## Installation

### 1. Copy Unit Files

Copy the systemd unit files to the user systemd directory:

```bash
# Create user systemd directory if it doesn't exist
mkdir -p ~/.config/systemd/user

# Copy the service and timer files
cp epd-display.service ~/.config/systemd/user/epd-display@.service
cp epd-display.timer ~/.config/systemd/user/epd-display@.timer
```

### 2. Enable and Start the Timer

```bash
# Reload systemd user daemon
systemctl --user daemon-reload

# Enable the timer (replace 'username' with your actual username)
systemctl --user enable epd-display@$(whoami).timer

# Start the timer
systemctl --user start epd-display@$(whoami).timer

# Enable lingering so services run when not logged in
sudo loginctl enable-linger $(whoami)
```

### 3. Remove Old Crontab Entry

```bash
# Edit crontab to remove the old entry
crontab -e

# Remove or comment out the line that calls display.sh
```

## Usage

### Check Timer Status
```bash
systemctl --user status epd-display@$(whoami).timer
```

### Check Service Status
```bash
systemctl --user status epd-display@$(whoami).service
```

### View Logs
```bash
# View service logs
journalctl --user -u epd-display@$(whoami).service

# View recent logs and follow
journalctl --user -u epd-display@$(whoami).service -f

# View timer logs
journalctl --user -u epd-display@$(whoami).timer
```

### Manual Execution
```bash
# Run the service manually
systemctl --user start epd-display@$(whoami).service
```

### Stop/Disable
```bash
# Stop the timer
systemctl --user stop epd-display@$(whoami).timer

# Disable the timer
systemctl --user disable epd-display@$(whoami).timer
```

## Configuration

### Timer Schedule

The timer is set to run every 15 minutes with a 30-second randomization delay. To change the schedule, edit `~/.config/systemd/user/epd-display@.timer`:

```ini
[Timer]
# Examples:
OnCalendar=*:0/10        # Every 10 minutes
OnCalendar=*-*-* 6:00:00 # Daily at 6 AM
OnCalendar=*-*-* 6,18:00:00 # Twice daily at 6 AM and 6 PM
```

After making changes:
```bash
systemctl --user daemon-reload
systemctl --user restart epd-display@$(whoami).timer
```

### Service Configuration

The service runs with these features:
- **User isolation**: Runs as your user account
- **Tool management**: Uses mise to execute pnpm commands with proper environment
- **Logging**: Outputs to `~/node-epd-display/display.log` and `~/node-epd-display/error.log`
- **Environment**: Sources `.env` file from the project directory
- **Security**: Runs with restricted permissions (no new privileges, private temp)
- **Network**: Waits for network connectivity before starting

## Advantages over Crontab

1. **Better logging**: Integrated with systemd journal + file logging
2. **Service management**: Start/stop/status commands
3. **Dependency handling**: Waits for network connectivity
4. **User isolation**: Runs in user session, no root required
5. **Persistent timers**: Catches up on missed runs if system was offline
6. **Randomization**: Prevents load spikes with RandomizedDelaySec
7. **Resource management**: Better process isolation and cleanup

## Troubleshooting

### Timer not running
```bash
# Check if timer is active
systemctl --user is-active epd-display@$(whoami).timer

# Check timer list
systemctl --user list-timers

# Check if lingering is enabled
loginctl show-user $(whoami) | grep Linger
```

### Service failing
```bash
# Check service logs
journalctl --user -u epd-display@$(whoami).service --no-pager

# Test the command manually
cd ~/node-epd-display && ~/.local/bin/mise exec -- pnpm run display

# Or if mise is in your PATH
cd ~/node-epd-display && mise exec -- pnpm run display
```

### Environment issues
Make sure your `.env` file exists and contains required variables:
```bash
cat ~/node-epd-display/.env
```