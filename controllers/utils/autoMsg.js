const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { getStatus } = require("../games/status");
// const memeMaker = require("@erickwendel/meme-maker");
const memeMaker = require("meme-maker");
let times = [];

exports.sticker = async (
    message,
    image,
    MessageMedia,
    topText,
    bottomText,
    padding,
    font
) => {
    let msg = message.hasMedia
        ? message
        : image
        ? image.hasMedia
            ? image
            : message
        : message;
    if (msg.hasMedia) {
        msg.downloadMedia().then(async (media) => {
            if (media) {
                const mediaPath = "./downloaded-media/";
                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                const extension = mime.extension(media.mimetype);
                const filename = new Date().getTime();
                let fullFilename = mediaPath + filename + "." + extension;
                try {
                    fs.writeFileSync(fullFilename, media.data, {
                        encoding: "base64",
                    });
                    // console.log("file downloaded!", fullFilename);
                    if (topText || bottomText) {
                        const options = {
                            image: fullFilename,
                            bottomText: bottomText || "",
                            topText: topText || "",
                            outfile:
                                "./downloaded-media/smeme" +
                                Math.random() * 1000 +
                                "." +
                                extension,
                            fontSize: font || 100,
                            strokeColor: "#000",
                            strokeWeight: 2,
                            textPos: "center",
                            padding: padding || 40,
                            // font: "/path/to/font.ttf",
                            // fontFill: "#FFF",
                        };

                        memeMaker(options, (err) => {
                            if (err)
                                return message.reply(
                                    `*failed to create smeme.*\ntry again!\n\n${err}`
                                );
                            fs.unlinkSync(fullFilename);
                            // console.log(`file deleted! ` + fullFilename);
                            const file = options.outfile;
                            // console.log("meme saved : " + file);
                            const meme = MessageMedia.fromFilePath(file);
                            this.stickers(
                                message,
                                new MessageMedia(meme.mimetype, meme.data, file)
                            );
                            fs.unlinkSync(file);
                            // console.log(`file deleted! ` + file);
                        });
                    } else {
                        this.stickers(
                            message,
                            new MessageMedia(
                                media.mimetype,
                                media.data,
                                fullFilename
                            )
                        );
                        fs.unlinkSync(fullFilename);
                        // console.log(`file deleted!`);
                    }
                } catch (err) {
                    // console.log("failed to save:", err);
                    // console.log(`file deleted!`, err);
                    message.reply(
                        `*failed to create sticker.*\ntry again!\n${err}`
                    );
                }
            }
        });
    } else {
        message.reply(`send image with caption *-sticker* to create sticker`);
    }
};

exports.stickers = async (message, MessageMedia) => {
    try {
        await message.reply(MessageMedia, message.from, {
            sendMediaAsSticker: true,
            stickerAuthor: "FreackBot",
            stickerName: "FreackStickers",
        });
    } catch (err) {
        message.reply(`*failed to create sticker.*\ntry again!\n\n${err}`);
    }
};

exports.img = async (
    msg,
    image,
    MessageMedia,
    topText,
    bottomText,
    padding,
    font
) => {
    let message = msg.hasMedia
        ? msg
        : image
        ? image.hasMedia
            ? image
            : msg
        : msg;
    if (message.hasMedia) {
        message.downloadMedia().then(async (media) => {
            if (media) {
                const mediaPath = "./downloaded-media/";
                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                const extension = mime.extension(media.mimetype);
                const filename = new Date().getTime();
                let fullFilename = mediaPath + filename + "." + extension;
                try {
                    fs.writeFileSync(fullFilename, media.data, {
                        encoding: "base64",
                    });
                    // console.log("file downloaded!", fullFilename);
                    if (topText || bottomText) {
                        const options = {
                            image: fullFilename,
                            bottomText: bottomText || "",
                            topText: topText || "",
                            outfile:
                                "./downloaded-media/meme" +
                                Math.random() * 1000 +
                                "." +
                                extension,
                            fontSize: font || 100,
                            strokeColor: "#000",
                            strokeWeight: 2,
                            textPos: "center",
                            padding: padding || 40,
                            // font: "/path/to/font.ttf",
                            // fontFill: "#FFF",
                        };

                        memeMaker(options, (err) => {
                            if (err)
                                return msg.reply(
                                    `*failed to create meme.*\ntry again!\n\n${err}`
                                );
                            fs.unlinkSync(fullFilename);
                            // console.log(`file deleted! ` + fullFilename);
                            const file = options.outfile;
                            // console.log("meme saved : " + file);
                            const im = MessageMedia.fromFilePath(file);
                            msg.reply(
                                new MessageMedia(im.mimetype, im.data, file)
                            );
                            fs.unlinkSync(file);
                            // console.log(`file deleted! ` + file);
                        });
                    } else {
                        const im = MessageMedia.fromFilePath(fullFilename);
                        await msg.reply(
                            new MessageMedia(im.mimetype, im.data, fullFilename)
                        );
                        fs.unlinkSync(fullFilename);
                        // console.log(`file deleted!`);
                    }
                } catch (err) {
                    // console.log("failed to save:", err);
                    // console.log(`file deleted!`, err);
                    message.reply(
                        `*failed to create image.*\ntry again!\n\n${err}`
                    );
                }
            }
        });
    } else {
        message.reply(
            `send sticker then reply with *-img* or *-toimg* to convert sticker to image`
        );
    }
};

exports.jadwalkuliah = (hari, msg) => {
    const file = fs.readFileSync("./database/jadwal_kuliah.json");
    let data = JSON.parse(file);
    if (hari != "all") {
        data = data.filter((d) => d.hari == hari);
        if (!data.length) {
            return msg.reply("the day that you input maybe typo. check again.");
        }
        data = data[0];
        let text = `*JADWAL KULIAH TI-B*\n\n\n*${data.hari.toUpperCase()}*\n`;
        data = data.data;
        data.forEach((d) => {
            text += `\n> ${d.matkul}\n> ${d.sks} SKS\n> ${d.dosen}\n> ${d.ruangan}\n> ${d.jam}\n> ${d.jumlah} Orang\n`;
        });
        msg.reply(text);
    } else {
        let text = `*JADWAL KULIAH TI-B*\n`;
        data.forEach((d) => {
            text += `\n\n*${d.hari.toUpperCase()}*\n`;
            d.data.forEach((mk) => {
                text += `\n> ${mk.matkul}\n> ${mk.sks} SKS\n> ${mk.dosen}\n> ${mk.ruangan}\n> ${mk.jam}\n> ${mk.jumlah} Orang\n`;
            });
        });
        msg.reply(text);
    }
};

exports.autoBot = (file, msg) => {
    const readStream = fs.createReadStream("./database/" + file, "utf8");

    readStream.on("data", function (chunk) {
        msg.reply(chunk);
    });
};

exports.error = (msg, err) => {
    msg.reply(
        "an error occured. type *-help* to see valid commands.\n\n" + err
    );
};

exports.group = (msg) => {
    msg.reply("This command can only be used in a group!");
};

exports.errai = (msg, err) => {
    msg.reply("sorry, i can't talk right now. something went wrong.\n\n" + err);
};

exports.timer = (grup, chat, gc) => {
    const i = grup + gc.GAME;
    times[i] = 0;
    const val = setInterval(() => {
        times[i]++;
        if (times[i] >= gc.TIME) {
            clearInterval(val);
            times[i] = 0;
            const game = getStatus(grup);
            if (game.status) {
                game.game.forEach((g) => {
                    if (g == gc.GAME) gc.end(grup, chat, -1);
                });
            }
        }
    }, 1000);
};

exports.setKW = (keyword, reply, msg) => {
    try {
        const file = fs.readFileSync("./database/keyword.json");
        let data = JSON.parse(file);
        data.push({
            keyword,
            reply,
        });
        fs.writeFileSync("./database/keyword.json", JSON.stringify(data));
        msg.reply("success add new keyword!");
    } catch (err) {
        this.error(msg, err);
    }
};

exports.upKW = (ok, keyword, reply, msg) => {
    try {
        const file = fs.readFileSync("./database/keyword.json");
        let data = JSON.parse(file);
        const ndata = data.filter((d) => d.keyword == ok);
        data = data.filter((d) => d.keyword != ok);
        if (!ndata.length) return msg.reply("keyword not found! try again.");
        data.push({
            keyword,
            reply,
        });
        fs.writeFileSync("./database/keyword.json", JSON.stringify(data));
        msg.reply("success edit selected keyword!");
    } catch (err) {
        this.error(msg, err);
    }
};

exports.delKW = (ok, msg) => {
    try {
        const file = fs.readFileSync("./database/keyword.json");
        let data = JSON.parse(file);
        const ndata = data.filter((d) => d.keyword == ok);
        data = data.filter((d) => d.keyword != ok);
        if (!ndata.length) return msg.reply("keyword not found! try again.");
        fs.writeFileSync("./database/keyword.json", JSON.stringify(data));
        msg.reply("success delete selected keyword!");
    } catch (err) {
        this.error(msg, err);
    }
};

exports.getKW = (keyword, msg) => {
    try {
        const file = fs.readFileSync("./database/keyword.json");
        let data = JSON.parse(file);
        data = data.filter((d) => keyword.includes(d.keyword));
        let text = "";
        if (data.length) {
            data.forEach((d) => {
                if (!text.includes(d.reply)) text += d.reply + "\n\n";
            });
            msg.reply(text.trim());
        }
    } catch (err) {
        console.log(err);
    }
};

exports.addTask = (kelas, mk, task, msg) => {
    try {
        const file = fs.readFileSync("./database/tugas_kuliah.json");
        let data = JSON.parse(file);
        let ndata = data.filter((d) => d.kelas == kelas && d.mk == mk);
        data.push({
            kelas,
            mk,
            task,
        });
        // if (!ndata.length) {
        //     data.push({
        //         kelas,
        //         mk,
        //         task,
        //     });
        // } else {
        //     data = data.filter((d) => d.kelas != kelas && d.mk != mk);
        //     task.forEach((t) => {
        //         ndata[0].task.push(t);
        //     });
        //     data.push(ndata[0]);
        // }
        fs.writeFileSync("./database/tugas_kuliah.json", JSON.stringify(data));
        msg.reply("success add task list.");
    } catch (err) {
        this.error(msg, err);
    }
};

exports.delTask = (kelas, mk, task, msg) => {
    try {
        const file = fs.readFileSync("./database/tugas_kuliah.json");
        let data = JSON.parse(file);
        let ndata = data.filter((d) => d.kelas == kelas && d.mk == mk);
        data = data.filter((d) => d.kelas != kelas && d.mk != mk);
        if (!ndata.length) return msg.reply("mk or task not found. try again.");
        if (task[0] != "all") {
            ndata = ndata[0];
            for (let i = 0; i < ndata.task.length; i++) {
                for (let j = 0; j < task.length; j++) {
                    if (ndata.task[i] == task[j]) {
                        ndata.task.splice(i, 1);
                    }
                }
            }
            data.push(ndata);
        }
        fs.writeFileSync("./database/tugas_kuliah.json", JSON.stringify(data));
        msg.reply("success delete selected task list.");
    } catch (err) {
        this.error(msg, err);
    }
};

function cMk(mk) {
    switch (mk) {
        case "sd":
            mk = "sistem digital";
            break;
        case "asd":
            mk = "algoritma struktur data";
            break;
        case "bing":
            mk = "bahasa inggris";
            break;
        case "arsikom":
            mk = "arsitektur dan organisasi komputer";
            break;
        case "md":
            mk = "matematika diskrit";
            break;
        case "imk":
            mk = "interaksi manusia dan komputer";
            break;
        case "ep":
            mk = "etika profesi";
            break;
        case "sm":
            mk = "sistem multimedia";
            break;
    }
    return mk;
}

exports.getTask = (kelas, mk, msg) => {
    try {
        const file = fs.readFileSync("./database/tugas_kuliah.json");
        let data = JSON.parse(file);
        if (mk != all) {
            data = data.filter((d) => d.kelas == kelas && d.mk == mk);
            if (!data.length)
                return msg.reply("mk or task not found. try again.");
            let text =
                "*DAFTAR TUGAS " +
                cMk(mk).toUpperCase() +
                " " +
                kelas.toUpperCase() +
                "*\n";
            data[0].task.forEach((d, i) => {
                text += "\n" + (i + 1) + ". " + d;
            });
            msg.reply(text);
        } else {
            data = data.filter((d) => d.kelas == kelas);
            let text = "*SEMUA DAFTAR TUGAS " + kelas.toUpperCase() + "*\n";
            data.forEach((dt) => {
                text += "\n*" + cMk(mk).toUpperCase() + "*";
                dt.task.forEach((d, i) => {
                    text += "\n" + (i + 1) + ". " + d;
                });
            });
            msg.reply(text);
        }
    } catch (err) {
        this.error(msg, err);
    }
};
