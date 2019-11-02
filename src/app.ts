#!/usr/bin/env node

import { exec } from 'child_process';

import { Commit } from './models/commit';
import { config } from './config/app.config';
import { LogToObject } from './helpers/log-to-object.helper';
import { Command } from './helpers/command.helper';
import { Neo4jHelper } from './helpers/neo4j.helper';

let commits = [];

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

    console.log('1. Ejecutando comandos');
    //Command.createLog();
    
    console.log('2. Convirtiendo log');
    commits = LogToObject.getCommits();

    //let commit = commits.filter(c=>c.id =='aa8bb12f0b562d1615c7cf6ccb49b593c4860f59')[0];

    console.log('3. Consultando archivos');
    let neo4j = new Neo4jHelper();

    for (let commit of commits.slice(0,50)) {

        let files = await neo4j.searchFiles(commit);

        //await neo4j.saveCommit(commit, files);
    }
    
    process.exit(0);
}

main();



