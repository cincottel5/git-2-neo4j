#!/usr/bin/env node

import { exec } from 'child_process';

import { Commit } from './models/commit';
import { config } from './config/app.config';
import { LogToObject } from './helpers/log-to-object.helper';
import { Command } from './helpers/command.helper';
import { Neo4jHelper } from './helpers/neo4j.helper';

import moment = require('moment');

let commits = [];

/**
 * Main execution;
 * 
 * argv[2] = repo url
 * argv[3] = base url
 * argv[4] = array of extensions
 */
async function main() {
    var startTime  = moment();

    console.log("\n******** 1. Ejecutando comandos **********\n");
    await Command.createLog();
    
    console.log("\n********* 2.  Convirtiendo log ***********\n");
    commits = LogToObject.getCommits();

    console.log("\n******** 3. Consultando archivos *********\n");
    let neo4j = new Neo4jHelper();

    let totalFiles = 0;
    let totalRelationships = 0;

    for (let commit of commits) {

        let files = await neo4j.searchFiles(commit);

        if (!Array.isArray(files)) continue;

        let savedFiles = await neo4j.saveCommit(commit, files);

        if (typeof savedFiles != 'number') {
            savedFiles = 0;
        }

        totalFiles += files.length;
        totalRelationships += savedFiles;
    }

    var endTime  = moment()
    var totalTime = endTime.diff(startTime, 'seconds');
    
    console.log("\n********* ===== Totales ====== ***********\n");
    console.log(`Cantidad de commits: ${commits.length}`);
    console.log(`Cantidad de archivos encontrados: ${totalFiles}`);
    console.log(`Cantidad de relaciones creadas: ${totalRelationships}`);
    console.log(`Tiempo total de ejecución: ${totalTime} segundos`);
    console.log("\n********** ======= Fin ======= ***********");
    process.exit(0);
}

main();



