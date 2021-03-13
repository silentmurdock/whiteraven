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

![Screenshot](https://camo.githubusercontent.com/5685604ee5dc9b71d25c417e2b9eb4bdbce62292853616af1e1727ba68672db9/68747470733a2f2f692e6962622e636f2f7234673451346a2f747673686f77732e6a7067)

![Screenshot](https://camo.githubusercontent.com/ebcae33f28aa5d66416fd6642ed1111baeaafcd07c41ae2d89a75cd752267a69/68747470733a2f2f692e6962622e636f2f316e4e524374422f696e747673686f772e6a7067)

![Screenshot](https://camo.githubusercontent.com/b0cc589071750fd810e06467b31b9d3d15d152203993a2cb995469cfee6f3e4e/68747470733a2f2f692e6962622e636f2f6638624d5768362f747673686f777375627469746c652e6a7067)

![Screenshot](https://camo.githubusercontent.com/1515d18a46aeed1af351c1469c7b09da4838cb65d45438b0d2fe15a011277d61/68747470733a2f2f692e6962622e636f2f50574e5a7632432f6d6f766965732e6a7067)

![Screenshot](https://camo.githubusercontent.com/c96f920145ba15b4a248f0cad82c04aa55a4aafba6b5efc67ecd730c45225b47/68747470733a2f2f692e6962622e636f2f5a534c583243682f686f7374736d656e752e6a7067)

![Screenshot](https://camo.githubusercontent.com/8e4e07f5a3563f27b5259214be53fdefef5291460b8426d8404408fb5a6d1558/68747470733a2f2f692e6962622e636f2f32644c786a56662f696e646f776e6c6f6164322e6a7067)

![Screenshot](https://camo.githubusercontent.com/9331e8ded6b2914226f9da722cc2b9f7a7b07823468ae3cecd7953b786c61db3/68747470733a2f2f692e6962622e636f2f52516d764b51792f6d6f7669657375627469746c652e6a7067)

![Screenshot](https://camo.githubusercontent.com/3cc130756ebb28b2f934c412a28b98d5e59cb4f94760a6c4324e895a024231f9/68747470733a2f2f692e6962622e636f2f6e3150363350372f696e73657474696e67732e6a7067)

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
1. Download the "whiteraven-0.4.2.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: $ sync -widgetfile="whiteraven-0.4.2.zip"   
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.4.2.zip" file's path.]
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
1. Download the "whiteraven-0.4.2.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: $ sync -widgetfile="whiteraven-0.4.2.zip"
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.4.2.zip" file's path.]
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
1. Download the "whiteraven-0.4.2.zip" file.
2. Download and extract one of the following installer executables according to your operating system: "sync-0.1.0-x32-windows.zip", "sync-0.1.0-x64-windows.zip", "sync-0.1.0-x32-linux.zip", "sync-0.1.0-x64-linux.zip"
3. Start the installer with the following command: $ sync -widgetfile="whiteraven-0.4.2.zip"
   [The "-widgetfile" parameter must be set to the previously downloaded "whiteraven-0.4.2.zip" file's path.]
4. Repeat the "setup server IP" process and change the IP address in step 4 to the one shows by the installer.
```
***BE CAREFUL, THE APPLICATION SYNCHRONIZATION REMOVE ALL PREVIOUSLY INSTALLED USER APPS FROM YOUR SAMSUNG SMART TV!***
</details>

### Install manually on rooted television
<details>
<summary>Steps for rooted Samsung Smart TV E, F, H series</summary>

```
1. Download or build the "whiteraven-0.4.2.zip" file.
2. Connect to your television over FTP/SFTP.
3. Create a folder named as "WhiteRaven" (Case sensitive!) inside the "/mtd_rwcommon/widgets/user" directory.
4. Extract the contents of the "whiteraven-0.4.2.zip" file to this directory.
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

#### For a rootless television the underlying server must run on an external device that connected to the same local network. You can download prebuilt servers for Windows or Linux from the [White Raven Server](https://github.com/silentmurdock/wrserver/releases/tag/v0.4.2) release page.
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
<summary>Build "whiteraven-rootless-0.4.2.zip" for rootless television</summary>

#### Download White Raven's source code:
```
$ go get -v -u github.com/silentmurdock/whiteraven
```
#### Build "whiteraven-rootless-0.4.2.zip":
```
$ go run build.go rootless
```
</details>

<details>
<summary>Build "whiteraven-0.4.2.zip" for rooted television</summary>

#### To create the widget, you need to download the prebuilt "wrserver-0.4.2-armv7-linux.tar.gz" ARM server executable from [White Raven Server](https://github.com/silentmurdock/wrserver/releases/tag/v0.4.2) release page or need to build it yourself with the following commands.

#### Download White Raven Server's source code:
```
$ go get -v -u github.com/silentmurdock/wrserver
```
#### Build "wrserver" for ARM:
```
$ set GOOS=linux
$ set GOARCH=arm
$ set GOARM=7
$ go build -ldflags="-s -w" -mod=vendor -o wrserver
```

#### Download White Raven's source code:
```
$ go get -v -u github.com/silentmurdock/whiteraven
```

#### Now you can able to make the White Raven widget by specifying the "-serverfile" parameter in the following build command. The "-serverfile" parameter must be set to the previously built or downloaded "wrserver" file's path.

#### Build "whiteraven-0.4.2.zip":
```
$ go run build.go rooted -serverfile="wrserver"
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