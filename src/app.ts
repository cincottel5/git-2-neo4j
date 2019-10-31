#!/usr/bin/env node

import { exec } from 'child_process';

import { Command } from './command';
import { Commit } from './commit';

/**
 * Main execution;
 */
async function main() {
    if (!process.argv[2]) {
        console.log("Not valid repo!!");
        return;
    }

    let firsStepCommands = [
        'rm public/log.txt',
        'mkdir public/repo',
        `git clone ${process.argv[2]} ./public/repo`,
        'git --git-dir=public/repo/.git log --stat >> public/log.txt',
        'rm -Rf public/repo'
    ];

    //await Command.execute(firsStepCommands);
    console.log('Finalizó extraer archivo');
    
    

    require('fs').readFileSync('public/log.txt', 'utf-8').split(/(\n|)(commit)!?./g).forEach(async function(commit){
        commit = commit.trim();
        if (commit == '' || commit == 'commit') return;

        //let reader = commit
        let object = new Commit();
        object.id = commit.match(/^(\s)?([\w]+)/g)[0];
        object.author = commit.match(/(?<=Author:).*/g)[0].trim();
        object.date = commit.match(/(?<=Date:).*/g)[0].trim();
        object.comment = commit.match(/(?<=\s{4}).*/g)[0].trim();
        
        // (?<=commit).*

        console.log("**********************************")
        console.log(object.id);
        console.log(object.author);
        console.log(object.date);
        console.log(object.comment);
        
        // find all files
        // (.)+(.java){1}(\s)*(\|)
        
        // Command.execute([`echo '\nCOMMIT\n' >> public/log2.txt`])
        // Command.execute([`echo '${commit}' >> public/log2.txt`])
    });
}

main();



