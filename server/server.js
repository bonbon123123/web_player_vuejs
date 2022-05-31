var fs = require("fs");
var http = require("http");
const { type } = require("os");
var path = require("path")
const Datastore = require("nedb")
var qs = require("querystring");
const formidable = require("formidable")

const coll = new Datastore({
    filename: __dirname + "/playlist.db",
    autoload: true
})


var server = http.createServer(function (req, res) {
    let tab = { files: [] }
    let basicPath = __dirname + "/static/mp3"


    if (req.url == "/admin") {
        fs.readFile(__dirname + "/static/admin.html", function (err, data) {
            res.writeHead(200, { "Content-Type": 'text/html; charset=UTF-8' });
            res.write(data);
            res.end()
        })
    }
    if (req.url == "/addSongToFiles") {

        let dir = Math.random() * 100000
        dir = (String(dir).slice(0, 5))
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(__dirname + "/static/mp3/" + dir);
        }
        let form = formidable({})
        form.keepExtensions = true;
        form.multiples = true
        form.uploadDir = __dirname + "/static/mp3/" + dir
        form.parse(req, function (err, fields, files) {
            console.log(files);

            if (!files.cover) {
                fs.copyFileSync(`${__dirname}/static/icons/missing.png`, `${__dirname + "/static/mp3/" + dir}/cover.png`)
            } else {
                fs.rename(files.cover.path, `${__dirname + "/static/mp3/" + dir}/cover.jpg`, function (err) {
                    if (err) console.log(err)
                    console.log("rename ok")
                });
            }
            if (files.songs) {
                console.log(files.songs.length)
                if (files.songs.length != undefined) {
                    files.songs.forEach(song => {
                        fs.rename(song.path, `${__dirname + "/static/mp3/" + dir}/${song.name}`, function (err) {
                            if (err) console.log(err)
                            console.log("rename ok")
                        });
                    });
                } else {
                    fs.rename(files.songs.path, `${__dirname + "/static/mp3/" + dir}/${files.songs.name}`, function (err) {
                        if (err) console.log(err)
                        console.log("rename ok")
                    });
                }
            }
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(files));
        });

    }
    if (req.url == "/addSong") {
        req.on("data", function (data) {
            let myData = JSON.parse(data)
            //console.log(myData)
            coll.find({ path: myData.path }).exec(function (err, docs) {
                if (docs[0] == undefined) {
                    coll.insert(myData, function (err, doc) {
                        console.log('Inserted', doc.name, 'with ID', doc._id);
                    });
                }
                else {
                    docs.forEach(function (d) {
                        console.log('Found user:', d.name);
                    });
                }
            });
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Hello World!');
            res.end();

        })

    }
    if (req.url == "/getPlaylist") {
        coll.find({}).exec(function (err, docs) {
            res.setHeader("Access-Control-Allow-Origin", "*");

            res.end(JSON.stringify(docs, null, 4));
        })
    }

    if (req.method == "GET") {
        if (req.url == "/first") {
            let countAlbums = -1
            fs.readdirSync(basicPath).forEach(fileName => {
                countAlbums++
                let obj = { 'albumName': fileName, "cover": {}, "songs": [], }
                tab.files.push(obj)
                fs.readdirSync(basicPath + "/" + fileName).forEach(file => {
                    var stats = fs.statSync(basicPath + "/" + fileName + '/' + file)
                    // console.log(file)
                    // console.log(file.slice(-4))
                    if (file.slice(-4) == ".jpg") {
                        tab.files[countAlbums].cover = ({
                            "name": file, "size": stats.size,
                            "path": "http://localhost:3000/" + "static/mp3" + "/" + fileName + '/' + file
                        })
                    }
                    if (file.slice(-4) == ".mp3") {
                        tab.files[countAlbums].songs.push({
                            "name": file, "size": stats.size,
                            "path": "http://localhost:3000/" + "static/mp3" + "/" + fileName + '/' + file
                        })
                    }

                });
            })
            res.setHeader("Access-Control-Allow-Origin", "*");
            //res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(tab, null, 4));

        };
        if (req.url.indexOf(".mp3") != -1) {
            let mp3FilePath = __dirname + decodeURI(req.url)
            let stats = fs.statSync(mp3FilePath)

            fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
                res.writeHead(200, {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": stats.size,
                    "Accept-Ranges": "bytes"
                });
                res.write(data);
                res.end();
            })
        }
        if (req.url.indexOf(".jpg") != -1) {
            fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
                res.writeHead(200, { "Content-type": "image/jpeg" });
                res.write(data);
                res.end();
            })
        }
        if (req.url.indexOf(".png") != -1) {
            fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
                res.writeHead(200, { "Content-type": "image/png" });
                res.write(data);
                res.end();
            })
        }

    };
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});

