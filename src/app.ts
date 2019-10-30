#!/usr/bin/env node

const { exec } = require('child_process');

/**
 * 3. Create directory
 */
exec('mkdir public/repo', (err, stdout, stderr) => {
    if (err) {
        console.error(err)
    } else {

        console.log("paso 1");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }
});

/**
 * 1. Download repository
 */

exec(`git clone ${process.argv[2]} ./public/repo`, (err, stdout, stderr) => {
    if (err) {
        console.error(err)
    } else {
        console.log("paso 2");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }
});

/**
 * 2. Create log file
 */

let command = 'git --git-dir=public/repo/.git log --stat >> public/log.txt'

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error(err)
    } else {
        console.log("paso 3");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }
});

/**
 * 3. Delete remote branch
 */
exec('rm -Rf public/repo', (err, stdout, stderr) => {
    if (err) {
        console.error(err)
    } else {
        console.log("paso 4");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }
});

