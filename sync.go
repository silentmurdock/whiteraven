package main

import (
	"flag"
	"fmt"
	"io"
	"net"
	"net/http"
	"log"
	"os"
	"strconv"
	"strings"
)

const (
    installerVersion string = "0.1.0"
    widgetName string = "WhiteRaven.zip"
)

func getFileSize(filepath string) (int64, error) {
    fi, err := os.Stat(filepath)
    if err != nil {
        return 0, err
    }
    // Get the size
    return fi.Size(), nil
}

func createWidgetlistXML(filesize int64, ip string) string {
	xml := `<?xml version="1.0" encoding="UTF-8"?>
			<rsp stat="ok">
			<list>
			<widget id="WhiteRaven">
			<title>White Raven</title>
			<compression size="` + strconv.FormatInt(filesize, 10) + `" type="zip"/>
			<description>Watch Movies And TV Shows From Torrents Instantly!</description>
			<download>http://` + ip + `/` + widgetName + `</download>
			</widget>
			</list>
			</rsp>`

	return strings.Replace(xml, "\t", "", -1)
}

func getLocalIP() string {
    conn, err := net.Dial("udp", "8.8.8.8:80")
    if err != nil {
        return "127.0.0.1"
    }
    defer conn.Close()

    localAddr := conn.LocalAddr().(*net.UDPAddr)

    return localAddr.IP.String()
}

func main() {
	fmt.Printf("White Raven Widget Installer For Legacy Samsung Smart TVs v%s\n", installerVersion)

	widgetPath := flag.String("widgetfile", "", "Set the path of widget file that need to be installed.")

	flag.Parse()

	if *widgetPath == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}

	// Check if file exist and get file size
	filesize, err := getFileSize(*widgetPath)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Printf("ERROR: \"%s\" not found!\nPlease check that the path you entered is correct.\n", *widgetPath)
			os.Exit(2)
		} else {
			log.Fatal(err)
		}
	}

	ip := getLocalIP()

    // Handle widgetlist.xml file
    http.HandleFunc("/widgetlist.xml", func(w http.ResponseWriter, r *http.Request) {		
		io.WriteString(w, createWidgetlistXML(filesize, ip))
	})

	// Handle WhiteRaven.zip file
    http.HandleFunc("/" + widgetName, func(w http.ResponseWriter, r *http.Request) {		
		http.ServeFile(w, r, *widgetPath)
	})

    // Print out server start message
    fmt.Printf("\nInstall server started on the following IP address: %s\nAfter the installation is complete, simply close this window or press Ctrl + C to exit!\n", ip)

    // Start the HTTP server
    log.Fatal(http.ListenAndServe(":80", nil))

}