#!/usr/bin/env node

/**
 * @file main.js
 *
 * Convert binary file content to C language array with type of unsigned char.
 *
 * Usage:
 *      node main.js <filename without .bin>
 *
 * Example: convert cert.bin to cert.c
 *      node main.js cert
 *
 * Output:
 *      cert.c
 *
 * @author www.shennongmin.org
 * @date 2017
 */

const fs = require("fs");
const util = require('util');

const argc = process.argv.length;
const args = process.argv;

if (argc !== 3 || args[2] === "--help") {
    let usage = "Usage:\r\n";
    usage += "    node main.js <filename without .bin>\r\n";
    usage += "Example: convert cert.bin to cert.c\r\n"
    usage += "    node main.js cert\r\n";

    console.log(usage);
    process.exit(1);
}

// for (let i = 0; i < process.argv.length; i += 1) {
//     console.log(`argv[${i}]: ${process.argv[i]}`);
// }

const filename = args[2];
const formatBin = filename + ".bin";
const formatC = filename + ".c";

/*
 * Read bin
 */
const file = fs.readFileSync(formatBin);
console.log(`read ${formatBin} done with length ${file.length} byte(s)`);


function addZero(str, length){
    return new Array(length - str.length + 1).join("0") + str;
}



/*
 * Convert to C language array.
 *
 * @code
 *  unsigned char <filename>[<length>] = {
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea
 *  };
 * @endcode
 */
console.log("Converting...");

let headerContent = "";

headerContent += "/* Wherever you copy this generated array to, please preserve comments including this line below with it! */\r\n";
headerContent += "/* You are ONLY allowed to change the name of the array below! */\r\n";
headerContent += `unsigned char ${filename}[${file.length}] = {\r\n`;
headerContent += "    /* The content of this array is generated from bin2carray package in npm */\r\n";
headerContent += "    /* DO NOT TOUCH ANY BYTES! */\r\n";

for(let i = 0; i < file.length; i += 1) {
    let rowIndex = i % 16;
    let isLast = i === file.length - 1;

    if (rowIndex === 0) {
        headerContent += "    ";
    }

    headerContent += "0x";
    headerContent += addZero(file.readUInt8(i).toString(16), 2);

    if (rowIndex < 15 && !isLast) {
        headerContent += ", ";
    } else if (rowIndex === 15 && !isLast) {
        headerContent += ",\r\n";
    } else {
        headerContent += "\r\n";
    }
}
headerContent += "};\r\n";

console.log("Convert done");

console.log("Saving...");
fs.writeFileSync(formatC, headerContent);
console.log(`Saved as ${formatC}`);
