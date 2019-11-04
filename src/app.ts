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
    console.log('1. Ejecutando comandos');
    await Command.createLog()

    console.log('2. Convirtiendo log');
    commits = LogToObject.getCommits();

    console.log('3. Consultando archivos');
    let neo4j = new Neo4jHelper();

    console.log(`Commits: ${commits.length}`);

    for (let commit of commits) {

        let files = await neo4j.searchFiles(commit);

        await neo4j.saveCommit(commit, files);
    }
    
    console.log("********** ======= Fin ======= ***********");
    process.exit(0);
}

main();



