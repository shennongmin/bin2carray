#!/usr/bin/env node

/**
 * @file main.js
 *
 * Convert binary file content to C language array with type of unsigned char.
 *
 * @author www.shennongmin.org
 */

const fs = require('fs');
const util = require('util');
const pkg = require('./package.json');
const os = require('os');

const argc = process.argv.length;
const args = process.argv;
const eol = os.EOL;

if (argc !== 3 || args[2] === `--help`) {
    let usage = `Usage:${eol}`;
    usage += `    bin2carray <filename without .bin>${eol}`;
    usage += `${eol}`;
    usage += `Example: convert hello.bin to hello.c${eol}`
    usage += `    bin2carray hello${eol}`;
    usage += `${eol}`;
    usage += `Version:${eol}    ${pkg.version}${eol}`;

    console.log(usage);
    process.exit(1);
}

if (args[2] === '--version' || args[2] === '-V') {
    console.log(`bin2carray ${pkg.version}`)
    process.exit(0);
}

const filename = args[2];
const formatBin = filename + `.bin`;
const formatC = filename + `.c`;

/*
 * Read bin
 */
const file = fs.readFileSync(formatBin);
console.log(`read ${formatBin} done with length ${file.length} byte(s)`);


function addZero(str, length){
    return new Array(length - str.length + 1).join(`0`) + str;
}



/*
 * Convert to C language array.
 *
 * @code
 *  const unsigned char bin2carray_<filename>[<length>] = {
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7,
 *      0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea, 0xff, 0xa7, 0x12, 0x34, 0xfe, 0xdc, 0xdd, 0xea
 *  };
 * @endcode
 */
console.log(`Converting...`);

let headerContent = ``;

headerContent += `/* Wherever you copy this generated array to, please preserve comments including this line below with it! */${eol}`;
headerContent += `/* You are ONLY allowed to change the name of the array below! */${eol}`;
headerContent += `const unsigned char bin2carray_${filename}[${file.length}] = {${eol}`;
headerContent += `    /* The content of this array is generated from bin2carray package in npm */${eol}`;
headerContent += `    /* DO NOT TOUCH ANY BYTES! */${eol}`;

for(let i = 0; i < file.length; i += 1) {
    let rowIndex = i % 16;
    let isLast = i === file.length - 1;

    if (rowIndex === 0) {
        headerContent += `    `;
    }

    headerContent += `0x`;
    headerContent += addZero(file.readUInt8(i).toString(16), 2);

    if (rowIndex < 15 && !isLast) {
        headerContent += `, `;
    } else if (rowIndex === 15 && !isLast) {
        headerContent += `,${eol}`;
    } else {
        headerContent += `${eol}`;
    }
}
headerContent += `};${eol}`;

console.log(`Convert done`);

console.log(`Saving...`);
fs.writeFileSync(formatC, headerContent);
console.log(`Saved as ${formatC}`);
