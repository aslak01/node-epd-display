# node-epd-display

Weather and transit chart for Waveshare 3.7" e-paper display using `@napi-rs/canvas` and native C drivers.

This is configured to build the following weather and local transit chart, including rain and transit delays, should there be any, based on data from `yr` and `entur`, configured locally on a Raspberry Pi to refresh every 10 minutes, to always contain relevant data.

Sample output

![Output image](docs/chart.png)

![Mocked output image](docs/mockchart.png)

This project draws an image to the waveshare screen every 10 minutes in order to contain useful transit information as well as the weather data, and is a replacement for my [previous system](https://miniweather.vercel.app) which was based on - https://github.com/samsonmking/epaper.js.

The reason that a new project was necessary was that `epaper.js` downloads a full Chrome onto the Pi's SD card at every redraw, and SD cards physically wear out from repeated rewrites. This caused my previous system to fail after running for about a year. Making it worse is that `epaper.js` depends on a particular and outdated version of Google Chrome that is hard to access so that even attempting to fix it by replacing the SD card is complicated.

This project instead of using the full selection of frontend web tech to render the chart, instead uses [`@napi-rs/canvas`](https://github.com/Brooooooklyn/canvas) to render the graphic in memory, and send it directly to the Waveshare display without writing anything but error logs to disk.

Requires [Waveshare dependencies](https://www.waveshare.com/wiki/3.7inch_e-Paper_HAT_Manual#Working_With_Raspberry_Pi) for display functionality.

## Usage

```bash
npm install
npm run preview # Preview in browser
npm run display # Display on Waweshare 3.7 hat
```

### Scheduling

There is `systemd` timer configuration included, as well as a setup script

```bash
./setup-systemd.sh
```

It uses systemd on your user (`systemd --user`) so in order to have the script continue running if you log out you need to enable lingering

```
sudo loginctl enable-linger $(whoami)
```

You can also setup a CRON job running the attached `./display.sh` script if you prefer
