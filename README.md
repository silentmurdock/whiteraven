# White Raven

**White Raven is a torrent player application for Samsung Smart TV E, F, H series. This repository contains the Smart TV Widget part of the application. The underlying server, which can be run on Windows, Linux, and rooted Samsung Smart TVs can be found in the [White Raven Server](https://github.com/silentmurdock/wrserver) repository. To ease the assembly and deployment process the repo also includes a builder and an installer application.**

## Features

- Torrent server can run locally on rooted TV.
- Torrent streaming from memory.
- Automatic subtitle search by IMDB ID, Text or by File Hash.
- Torrent receiver page allow to stream any magnet link or torrent file.
- Favourites handler.
- Subtitle style settings.
- You can play torrents with multiple video files inside.

## Screenshots

![Screenshot](https://user-images.githubusercontent.com/52458669/138864485-19c5730f-13b8-4e87-a080-4bb88483af39.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/138864525-5f444c9a-8617-4843-8409-581abd95c769.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/137933681-daf33545-09f8-4df4-94d4-d5f18f24d25c.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/138864464-b66d3397-4102-49ce-8fa0-4a5a21f87934.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/138864811-cf848bf3-689d-46ae-996a-b560745a65df.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/138864821-309b54ce-718d-478b-bf48-f5d867bae3c0.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/137934439-acfba761-b822-4591-b11a-60b3b3fedc10.jpg)

![Screenshot](https://user-images.githubusercontent.com/52458669/138864986-6e37eea1-b8df-43ec-9a74-3cac29e52710.jpg)

## How to install

### Install with application synchronization
<details>
<summary>Steps for Samsung Smart TV E series</summary>

#### For easier use, the latest version of White Raven is available from an online application synchronization server. This way only the television is required for the installation.

#### First you need to enable developer mode on your Samsung Smart TV E type.
```
1. Open the Smart Hub.
2. Press "Tools" on the remote.
3. Select "Login".
4. Select "Samsung Account".
5. Enter "develop" as your Samsung Account ID.
6. Enter "000000" to the Password field.
7. Press Login.
```
#### Now you can setup server IP and install White Raven.
```
1. Open the Smart Hub.
2. Press "Tools" on the remote.
3. Select "Settings".
4. Select "Development".
5. Check the box to "Agree" to the "Terms of Service Agreement".
6. Select "OK".
7. Select "Setting Server IP".
8. Enter the following IP address: [ 107.189.7.41 ]
9. Select "User Application Synchronisation".
```
#### The television will connect to the server and install White Raven.
**If for some reason the online server is unavailable you can use the prebuilt releases to install White Raven!**
```
1. Download the "whiteraven-0.5.1.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: sync -widgetfile="whiteraven-0.5.1.zip"   
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.5.1.zip" file's path.]
4. Repeat the "setup server IP" process and change the IP address in step 8 to the one shows by the installer.
```
***BE CAREFUL, THE APPLICATION SYNCHRONIZATION REMOVE ALL PREVIOUSLY INSTALLED USER APPS FROM YOUR SAMSUNG SMART TV!***
</details>

<details>
<summary>Steps for Samsung Smart TV F series</summary>

#### For easier use, the latest version of White Raven is available from an online application synchronization server. This way only the television is required for the installation.

#### First you need to enable developer mode on your Samsung Smart TV F type.
```
1. In the main menu scroll down to "Smart Features" and press the Enter button.
2. Select "Samsung Account".
3. Select "Log In".
4. In the E-mail field enter "develop".
5. Leave the password field empty.
6. Press "Login".
7. Exit from all the menus.
```
#### Now you can setup server IP and install White Raven.
```
1. Press the Smart Hub button on the remote and scroll to Apps.
2. Select "More Apps" at the bottom of the screen.
3. Select "Options" at the top right corner of the screen.
4. Select "IP Setting".
5. Enter the following IP address: [ 107.189.7.41 ]
6. Choose "Start App Sync" from the Options menu.
```
#### The television will connect to the server and install White Raven.
**If for some reason the online server is unavailable you can use the prebuilt releases to install White Raven!**
```
1. Download the "whiteraven-0.5.1.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: sync -widgetfile="whiteraven-0.5.1.zip"
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.5.1.zip" file's path.]
4. Repeat the "setup server IP" process and change the IP address in step 5 to the one shows by the installer.
```
***BE CAREFUL, THE APPLICATION SYNCHRONIZATION REMOVE ALL PREVIOUSLY INSTALLED USER APPS FROM YOUR SAMSUNG SMART TV!***
</details>

<details>
<summary>Steps for Samsung Smart TV H series</summary>

#### For easier use, the latest version of White Raven is available from an online application synchronization server. This way only the television is required for the installation.

#### First you need to enable developer mode on your Samsung Smart TV H type.
```
1. In the main menu select "Smart Hub".
2. Select "Samsung Account."
3. Select "Login".
4. Enter "develop" as the username.
5. Enter "000000" as the password.
6. Press "Login".
```
#### Now you can setup server IP and install White Raven.
```
1. Press the Smart Hub button on the remote and go to My App's list.
2. Select any of the existing apps and keep holding the "OK" button in the remote until a pop up window appears.
3. Select "IP Setting".
4. Enter the following IP address: [ 107.189.7.41 ]
5. Select any of the existing apps and keep holding the "OK" button in the remote until the previous pop up window appears.
6. Choose "Start User App Sync" from the options.
```
#### The television will connect to the server and install White Raven.
**If for some reason the online server is unavailable you can use the prebuilt releases to install White Raven!**
```
1. Download the "whiteraven-0.5.1.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: sync -widgetfile="whiteraven-0.5.1.zip"
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.5.1.zip" file's path.]
4. Repeat the "setup server IP" process and change the IP address in step 4 to the one shows by the installer.
```
***BE CAREFUL, THE APPLICATION SYNCHRONIZATION REMOVE ALL PREVIOUSLY INSTALLED USER APPS FROM YOUR SAMSUNG SMART TV!***
</details>

### Install manually on rooted television
<details>
<summary>Steps for rooted Samsung Smart TV E, F, H series</summary>

```
1. Download or build the "whiteraven-0.5.1.zip" file.
2. Connect to your television over FTP/SFTP.
3. Create a folder named as "WhiteRaven" (Case sensitive!) inside the "/mtd_rwcommon/widgets/user" directory.
4. Extract the contents of the "whiteraven-0.5.1.zip" file to this directory.
5. Reboot your television.
6. After reboot White Raven should show up in the apps section.
```
</details>

## How to use

<details>
<summary>Use on a rooted television</summary>

#### On a rooted televison White Raven works as a standalone application. You just need to start it to watch videos.
</details>

<details>
<summary>Use on a rootless television</summary>

#### For a rootless television the underlying server must run on an external device that connected to the same local network. You can download prebuilt servers for Windows or Linux from the [White Raven Server](https://github.com/silentmurdock/wrserver/releases/tag/v0.5.1) release page.
```
1. Extract and run the downloaded server.
   [You may need to allow it to access the Internet.]
2. Start the White Raven application on the television.
   [If all goes well, it will automatically find the server and connect to it.]
```
</details>

## Build instructions

### Build on Windows
<details>
<summary>Build "whiteraven-rootless-0.5.1.zip" for rootless television</summary>

#### Build "whiteraven-rootless-0.5.1.zip":
```
set GO111MODULE=on
go run build.go rootless
```
</details>

<details>
<summary>Build "whiteraven-0.5.1.zip" for rooted television</summary>

#### To create the widget, you need to download the prebuilt "wrserver-0.5.1-armv7-linux.tar.gz" ARM server executable from [White Raven Server](https://github.com/silentmurdock/wrserver/releases/tag/v0.5.1) release page or need to build it yourself with the following commands.

#### Build "wrserver" for ARM:
```
set GO111MODULE=on
set GOOS=linux
set GOARCH=arm
set GOARM=7
go build -ldflags="-s -w" -o wrserver
```

#### Now you can able to make the White Raven widget by specifying the "-serverfile" parameter in the following build command. The "-serverfile" parameter must be set to the previously built or downloaded "wrserver" file's path.

#### Build "whiteraven-0.5.1.zip":
```
set GO111MODULE=on
go run build.go rooted -serverfile="wrserver"
```
</details>

## Donation
Donations are welcome and will go towards further development of this project as well as my other projects. Use the wallet addresses or the Patreon link below to donate.
```
BTC: 3NHNGcGEyD3m88nWZpNCSjnGq95rgFq4P5
LTC: MNyTkncUNkLgv8TCuPn69NVvBXnEsrtWcW
```
```
PATREON: https://www.patreon.com/murdock
```

## Terms Of Service
[TERMS OF SERVICE](TOS)

## License
[GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)