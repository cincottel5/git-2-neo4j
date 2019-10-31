#!/usr/bin/env node

import { exec } from 'child_process';

import { Command } from './command';
import { Commit } from './models/commit';

/**
 * Main execution;
 * 
 * argv[2] = repo url
 * argv[3] = base url
 * argv[4] = array of extensions
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
    
    let baseRoute = '/src';


    require('fs').readFileSync('public/log.txt', 'utf-8').split(/(\n|)(commit)!?./g).forEach(async function(commit){
        commit = commit.trim();
        if (commit == '' || commit == 'commit') return;

        //let reader = commit
        //let object = new Commit(commit);
        
        // (?<=commit).*

        console.log("**********************************")
        // console.log(object.id);
        // console.log(object.author);
        // console.log(object.date);
        // console.log(object.comment);

        let files = commit.match(/(.)+(.java){1}(\s)*(\|)/g)||[];

        //console.log(files.length);
        for (let f of files) {
            let split = f.split(/(\/src\/)/)||[];

            if (split.length < 1) continue;

            let fullName = split[split.length-1]
                .replace('|', '').trim();


            let qualifiedName = fullName.replace(/(\/|\\)/g, '.');
            
            let splitFullName = fullName.split(/(\/|\\)/g)||[];

            let className = splitFullName[splitFullName.length-1];
                

            //let nameString = split[split.length-1].split(/(\/|\\)/g)
            console.log(`qualifiedName: ${qualifiedName} - class name: ${className}`);
            // let realName =  f.split(/(\/src\/)/)||[];
            // realName = realName[realName.length-1];


        }
        
        // find all files
        // (.)+(.java){1}(\s)*(\|)
        
        // Command.execute([`echo '\nCOMMIT\n' >> public/log2.txt`])
        // Command.execute([`echo '${commit}' >> public/log2.txt`])
    });
}

main();



