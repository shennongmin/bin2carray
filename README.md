# bin2carray

## Description

Convert binary file content to C language array with type of unsigned char.

## Install

    npm install -g bin2carray

## Help

For help, run: 

    bin2carray --help

## Usage

    Usage:
        bin2carray <filename without .bin>
    
    Example: convert hello.bin to hello.c
        bin2carray hello

## A Example

Now, if you create hello.bin via running:

    echo "hello" > hello.bin
    
After `bin2carray hello`, `hello.c` will be generated like below:

    /* Wherever you copy this generated array to, please preserve comments including this line below with it! */
    /* You are ONLY allowed to change the name of the array below! */
    const unsigned char hello[6] = {
        /* The content of this array is generated from bin2carray package in npm */
        /* DO NOT TOUCH ANY BYTES! */
        0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a
    };
