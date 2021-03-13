package main

import (
    "archive/tar"
    "archive/zip"
    "bytes"
    "compress/gzip"
    "encoding/xml"
    "errors"
    "flag"
    "fmt"
    "io"
    "io/ioutil"
    "math"
    "os"
    "path/filepath"
    "strings"
    "time"

    "github.com/tdewolff/minify/v2"
    "github.com/tdewolff/minify/v2/css"
    "github.com/tdewolff/minify/v2/js"
    "github.com/tdewolff/minify/v2/json"
)

const (
    builderVersion string = "0.1.0"

    serverName string = "wrserver"
    legacyRoot string = "widget/"
    serverRoot string = legacyRoot + "server/"
    tarGzFilePath string = legacyRoot + "server/" + serverName + ".tar.gz"
    defaultZipName string = "whiteraven.zip"
    initScriptName string = "server.init"
    configFilePath string = legacyRoot + "config.xml" // Needed for version detection

    mainName string = "Main.js"
    detectRootCode string = "var detectedValues = DetectRoot();"
    blockRootDetectCode string = "var detectedValues = { isRooted: false, isSupported: false };"

    originalTarPieces string = "TAA=\"$WIDGETDIR/$WIDGETNAME/server/wrserver.taa\"\n"
    middleTarPieces string = "$WIDGETDIR/$WIDGETNAME/server/wrserver."

    originalIfPieces string = "if [ -e \"$TAA\" ]; then"

    fileChunk = 1 * (1 << 20) // 1 MB
)

// Version detection from config.xml file
type ConfigXML struct {
    Version string `xml:"ver"`
}

// Some global variables
var zipName string = defaultZipName
var widgetVersion = ""

var builtTarPieces string = ""
var builtIfPieces string = "if "

func readVersionFromConfig(path string) string {
    xmlFile, err := os.Open(path)
    if err != nil {
        return "" // Do not generate error
    }
    defer xmlFile.Close()

    byteValue, err := ioutil.ReadAll(xmlFile)
    if err != nil {
        return "" // Do not generate error
    }

    var config ConfigXML
    xml.Unmarshal(byteValue, &config)

    return config.Version
}

func createServerTarGz(path string) error {
    // Create output file
    outFile, err := os.Create(tarGzFilePath)
    if err != nil {
        return err
    }
    defer outFile.Close()

    gw := gzip.NewWriter(outFile)
    defer gw.Close()
    tw := tar.NewWriter(gw)
    defer tw.Close()

    err = addFileToTarGz(tw, path)
    if err != nil {
        return err
    }

    return nil
}

func addFileToTarGz(tw *tar.Writer, filename string) error {
    // Open the file which will be written into the archive
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // Get FileInfo about our file providing file size, mode, etc.
    info, err := file.Stat()
    if err != nil {
        return err
    }

    var ident [4]uint8
    file.ReadAt(ident[0:], 0)
    
    if ident[0] != '\x7f' || ident[1] != 'E' || ident[2] != 'L' || ident[3] != 'F' {
        return errors.New("The specified file is not a Linux executable.")
    }

    // Create a tar Header from the FileInfo data
    header, err := tar.FileInfoHeader(info, info.Name())
    if err != nil {
        return err
    }

    // Use full path as name (FileInfoHeader only takes the basename)
    header.Name = filename
    // Need to set mode bits to achieve 755 permission
    header.Mode = 493
    // Need to set Uname to "root"
    header.Uname = "root"
    // Need to set Format to "GNU"
    header.Format = tar.FormatGNU
    // Write file header to the tar archive
    err = tw.WriteHeader(header)
    if err != nil {
        return err
    }

    // Copy file content to tar archive
    _, err = io.Copy(tw, file)
    if err != nil {
        return err
    }

    return nil
}

func splitTarGz() error {
    file, err := os.Open(tarGzFilePath)
    if err != nil {
        return err
    }
    defer file.Close()

    fileInfo, _ := file.Stat()
    var fileSize int64 = fileInfo.Size()

    // Calculate total number of parts the file will be chunked into.
    totalPartsNum := uint64(math.Ceil(float64(fileSize) / float64(fileChunk)))

    fmt.Printf("Split %s to %d pieces.\n", serverName + ".tar.gz", totalPartsNum)

    // Max len(alphabet) * len(alphabet) pieces suported
    firstChar := -1
    alphabet := "abcdefghijklmnopqrstuvwxyz"

    for i := uint64(0); i < totalPartsNum; i++ {
        partSize := int(math.Min(fileChunk, float64(fileSize-int64(i*fileChunk))))
        partBuffer := make([]byte, partSize)

        file.Read(partBuffer)

        if i % uint64(len(alphabet)) == 0 {
            firstChar++
        }

        fileName := serverName + ".t"+ string(alphabet[firstChar]) + string(alphabet[i])
        _, err := os.Create(serverRoot + fileName)
        if err != nil {
            return err
        }

        ioutil.WriteFile(serverRoot + fileName, partBuffer, os.ModeAppend)

        extension := "t"+ string(alphabet[firstChar]) + string(alphabet[i])
        builtTarPieces = builtTarPieces + strings.ToUpper(extension) + "=\"" + middleTarPieces + extension + "\"\n"

        builtIfPieces = builtIfPieces + "[ -e \"$" + strings.ToUpper(extension) + "\" ]"
        if i < totalPartsNum - 1 {
            builtIfPieces += " && "
        } else {
            builtIfPieces += "; then"
        }
    }

    return nil
}

func buildReleaseFromDirectory(root string, buildRootless bool) error {
    // Creat filename
    if buildRootless == true {
        zipName = strings.Replace(defaultZipName, ".", "-rootless-" + widgetVersion + ".", -1)
    } else {
        zipName = strings.Replace(defaultZipName, ".", "-" + widgetVersion + ".", -1)
    }

    // Create output file
    outFile, err := os.Create(zipName)
    if err != nil {
        return err
    }
    defer outFile.Close()

    zipWriter := zip.NewWriter(outFile)
    defer zipWriter.Close()

    fmt.Println("Minify css, js and json files.")

    err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        // Remove server directory from rootless widget
        if buildRootless == true {
            tmpPath := strings.Replace(path, "\\", "/", -1)
            tmpServerRoot := strings.TrimSuffix(serverRoot, "/")

            if strings.HasPrefix(tmpPath, tmpServerRoot) {
                return nil
            }
        }

        miniData := []byte{}
        if info.IsDir() == false {
            miniData, err = minifyFile(path, buildRootless)
            if err != nil {
                return err
            }
        }

        path = strings.Replace(path, "\\", "/", -1)
        relPath := strings.TrimPrefix(path, root)

        err = addFileToZip(zipWriter, miniData, relPath, info)
        if err != nil {
            return err
        }

        return nil
    })

    if err != nil {
        return err
    }

    return nil
}

func minifyFile(path string, buildRootless bool) ([]byte, error) {
    content, err := ioutil.ReadFile(path)
    if err != nil {
        return []byte{}, err
    }

    r := bytes.NewBuffer(content)
    var buff bytes.Buffer

    m := minify.New()

    switch filepath.Ext(path) {
    case ".js":
        // Block root detection in Main.js with replacing some part of the source code.
        if buildRootless == true && filepath.Base(path) == mainName {
            content = bytes.Replace(content, []byte(detectRootCode), []byte(blockRootDetectCode), 1)
            r = bytes.NewBuffer(content)
        }
        err = js.Minify(m, &buff, r, nil)
        if err != nil {
            return []byte{}, err
        }

        return buff.Bytes(), nil
    case ".css":
        err = css.Minify(m, &buff, r, nil)
        if err != nil {
            return []byte{}, err
        }

        return buff.Bytes(), nil
    case ".json":
        err = json.Minify(m, &buff, r, nil)
        if err != nil {
            return []byte{}, err
        }

        return buff.Bytes(), nil
    case ".init":
        // Check all tar piece in server.init with replacing some part of the script.
        if buildRootless == false && filepath.Base(path) == initScriptName {
            content = bytes.Replace(content, []byte(originalTarPieces), []byte(builtTarPieces), 1)
            content = bytes.Replace(content, []byte(originalIfPieces), []byte(builtIfPieces), 1)
            r = bytes.NewBuffer(content)
        }
    }

    return content, nil
}

func addFileToZip(zipWriter *zip.Writer, data []byte, path string, info os.FileInfo) error {
    if path == "" {
        return nil
    }

    header, err := zip.FileInfoHeader(info)
    if err != nil {
        return err
    }

    header.Name = path

    if info.IsDir() == true {
        header.Name += "/"
        header.SetMode(0755)
    } else {
        header.Method = zip.Deflate
        header.SetMode(0644)
        header.UncompressedSize = uint32(len(data))
        switch filepath.Ext(path) {
        case ".js":
            header.SetModTime(time.Now())
        case ".css":
            header.SetModTime(time.Now())
        case ".json":
            header.SetModTime(time.Now())
        }
    }

    zipFile, err := zipWriter.CreateHeader(header)
    if err != nil {
        return err
    }

    if info.IsDir() == true {
        return nil
    }

    _, err = zipFile.Write(data)
    if err != nil {
        return err
    }

    return nil
}

func deleteTmpFiles(root string) error {
    fmt.Println("Delete all temporary files.")
    err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if info.IsDir() == false && filepath.Base(path) != initScriptName {
            err = os.Remove(path)
            if err != nil {
                return err
            }
        }

        return nil
    })

    if err != nil {
        return err
    }

    return nil
}

func usageGuide() {
    fmt.Printf("Usage of %s:\n", os.Args[0])
    rootedText := "rooted"
    rootedDesc := "Build widget for rooted Samsung Smart TVs."

    rootlessText := "rootless"
    rootlessDesc := "Build widget for Samsung Smart TVs without root."

    fmt.Printf("%*s\n", 2 + len(rootedText), rootedText)
    fmt.Printf("%*s\n", 8 + len(rootedDesc), rootedDesc)
    fmt.Printf("%*s\n", 2 + len(rootlessText), rootlessText)
    fmt.Printf("%*s\n", 8 + len(rootlessDesc), rootlessDesc)

    os.Exit(2)
}

func main() {
    fmt.Printf("White Raven Widget Builder For Legacy Samsung Smart TVs v%s\n", builderVersion)

    rootless := flag.NewFlagSet("rootless", flag.ExitOnError)

    rooted := flag.NewFlagSet("rooted", flag.ExitOnError)
    serverFile := rooted.String("serverfile", "", "Specify the path of \"" + serverName + "\" executable file that compiled for Samsung Smart TVs.")

    if len(os.Args) < 2 {
        usageGuide()
    }

    buildRootless := false

    // Check if config.xml file and version number exist.
    widgetVersion = readVersionFromConfig(configFilePath)

    switch os.Args[1] {
    case "rooted":
        rooted.Parse(os.Args[2:])
        if len(rooted.Args()) != 0 {
            fmt.Printf("Unknown parameter(s): %v\n", rooted.Args())
            fmt.Printf("Usage of %s:\n", os.Args[1])
            rooted.PrintDefaults()
            os.Exit(2)
        } else if *serverFile == "" {
            fmt.Printf("Usage of %s:\n", os.Args[1])
            rooted.PrintDefaults()
            os.Exit(2)
        } else if filepath.Base(*serverFile) != serverName {
            fmt.Printf("The \"%s\" executable file cannot be found in the specified path.\n", serverName)
            os.Exit(2)
        } else if widgetVersion == "" {
            fmt.Printf("The \"%s\" file cannot be found or cannot contain version information.\n", configFilePath)
            os.Exit(2)
        } else {
            fmt.Printf("\nCompress %s to %s.tar.gz archive.\n", serverName, serverName)
            err := createServerTarGz(*serverFile)
            if err != nil {
                fmt.Printf("Unable to create %s.tar.gz file.\n -> %v\n", serverName, err)
                err = deleteTmpFiles(serverRoot)
                if err != nil {
                    fmt.Printf("Temporary files cannot be deleted.\n -> %v\n", err)
                }
                os.Exit(2)
            }

            err = splitTarGz()
            if err != nil {
                fmt.Printf("Unable to split %s.tar.gz file.\n -> %v\n", serverName, err)
                err = deleteTmpFiles(serverRoot)
                if err != nil {
                    fmt.Printf("Temporary files cannot be deleted.\n -> %v\n", err)
                }
                os.Exit(2)
            }

            fmt.Printf("Delete %s.tar.gz archive.\n", serverName)
            err = os.Remove(tarGzFilePath)
            if err != nil {
                fmt.Printf("Unable to delete %s.tar.gz file.\n -> %v\n", serverName, err)
                os.Exit(2)
            }
        }
    case "rootless":
        rootless.Parse(os.Args[2:])
        if len(rootless.Args()) != 0 {
            fmt.Printf("Unknown parameter(s): %v\n", rootless.Args())
            os.Exit(2)
        } else if widgetVersion == "" {
            fmt.Printf("The \"%s\" file is not found or does not contain widget version information.\n", configFilePath)
            os.Exit(2)
        }

        buildRootless = true
    default:
        usageGuide()
    }
    
    err := buildReleaseFromDirectory(legacyRoot, buildRootless)
    if err != nil {
        fmt.Printf("Unable to create %s widget.\n -> %v\n", zipName, err)
        err = deleteTmpFiles(serverRoot)
        if err != nil {
            fmt.Printf("Temporary files cannot be deleted.\n -> %v\n", err)
        }
        os.Exit(2)
    }
    
    err = deleteTmpFiles(serverRoot)
    if err != nil {
        fmt.Printf("Temporary files cannot be deleted.\n -> %v\n", err)
    }

    fmt.Printf("\nBuild completed successfully!\n%s is ready to install.\n", zipName)
}