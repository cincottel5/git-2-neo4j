import { config } from '../config/app.config';
import { Commit } from '../models/commit';
import { File } from '../models/file';

import { v1 as neo4j } from 'neo4j-driver';
import  validator  from 'validator';

export class Neo4jHelper {
    protected driver;

    /**
     * Constructor
     */
    constructor() {
        try {
            this.driver = neo4j.driver(
                `bolt://${config.neo4j_host}:${config.neo4j_port}`,
                neo4j.auth.basic(config.neo4j_user, config.neo4j_pass));
        } catch (e) {
            console.log("****************************************");
            console.log("Error en la conexión de base  de datos");
            console.log(e);
            console.log("****************************************");

            throw e;
        }
    }

    /**
   * Basic simple query
   * @param query 
   */
    protected run(query) {
        let session = this.driver.session();

        return session
            .run(query)
            .then(result => {
                session.close();
                return result;
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }

    /**
     * 
     */
    async searchFiles(commit: Commit) {
        let q1 = `match (p:Project)-[:HAS_CLASS]->(c:Class) where p.id = '${config.neo4j_project_id}' `;
        let qRet = ' return c';  

        let filesToSave = [];

        for (let file of commit.files) {
            let fQuery = `and c.name='${file.name}'`
            let query = "".concat(q1, fQuery, qRet);
            let result;

            try {
                result = await this.run(query);
            }
            catch (e) {
                console.log("Error Neo4j - buscando archivos");
                console.log(query);
                continue;
                //throw e;
            }

            if (result == undefined) return;
            
            if (result.records.length == 1) {
                filesToSave.push(result.records[0]);

            } else if (result.records.length >= 2) {
                let maxCoincidence = 0;
                let maxRecord = result.records[0];

                if (file.words.size >= 1) {
                    for (let r of result.records) {
                        
                        let recordCoincidence = 0;

                        file.words.forEach(element => {
                            if (r.get('c').properties.qualifiedname.toLowerCase().indexOf(element.toLowerCase()) > -1)
                                recordCoincidence++;
                        });
    
                        if (recordCoincidence > maxCoincidence) {
                            maxCoincidence = recordCoincidence;
                            maxRecord = r;
                        }
                    }       
                }

                filesToSave.push(maxRecord);
            } 
        }
        return filesToSave;
    }

    isIterable(obj) {
        // checks for null and undefined
        if (obj == null) {
          return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
      }

    /**
     * Save the commit relationships
     * @param commit 
     * @param files 
     */
    async saveCommit(commit:Commit, files) {
        if (files != null && files.length < 1 && !this.isIterable(files)) return;

        let comment = validator.escape(commit.comment||'');

        let commitQuery = [
            ` (commit:Commit{id: '${commit.id}', `,
            ` author: '${commit.author}', `,
            ` date:'${commit.date}', `,
            ` comment: '${comment}'}) `
        ];

        let savedFiles = 0;

        for ( let file of files ) {
            let relQuery = [
                ` MATCH (p:Project{id:'${config.neo4j_project_id}'})-[:HAS_CLASS]->(class:Class) `,
                ` WHERE class.qualifiedname = '${file.get('c').properties.qualifiedname}' `,
                ` MERGE ${commitQuery.join(' ')}`,
                ` MERGE (p)-[:HAS_COMMIT]->(commit) `,
                ` MERGE (class)-[:CHANGED_IN]->(commit) `,
                ` ON CREATE SET class.changes_count = 1 `,
                ` ON MATCH SET class.changes_count = class.changes_count + 1 `
            ];

            try {

                await this.run(relQuery.join(' '));
                savedFiles++;

                await this.commitFileRelationship(file, files);
            }
            catch (e) {
                console.log("Error Neo4j - guardando archivos");
                console.log(relQuery.join(' '));
                console.log(e);
            }
        }

        savedFiles = typeof savedFiles == 'number' ? savedFiles : 0;

        console.log(`Commit: ${commit.id}`);
        console.log(`Archivos encontrados: ${files.length}`);
        console.log(`Relaciones creadas: ${savedFiles}`);
        console.log(`*****************`);

        return savedFiles;
    }

    async commitFileRelationship(file, files) {
        let relFiles = files.filter( function(x) { 
            return x != file
        });

        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('Archivo');
        // console.log(file.get('c').properties.qualifiedname);
        // console.log('Archivos');
        // console.log(files.map(x=>x.get('c').properties.qualifiedname));
        // console.log('Filtrado');
        // console.log(relFiles.map(x=>x.get('c').properties.qualifiedname));
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n');
        // return;

        for (let fi of relFiles) {
            let query = [
                ` match (p:Project{id: '${config.neo4j_project_id}'})-[:HAS_CLASS]->(c1:Class { 
                  qualifiedname: '${file.get('c').properties.qualifiedname}'}), 
                  (p:Project{id: '${config.neo4j_project_id}'})-[:HAS_CLASS]->(c2:Class{
                  qualifiedname: '${fi.get('c').properties.qualifiedname}'}) `,
                ` merge (c1)-[r:CO_EVOLVE]-(c2) 
                  ON CREATE SET r.changes_count = 1 
                  ON MATCH SET r.changes_count = r.changes_count + 1`
            ];

            try {
                await this.run(query.join(' '));
            }
            catch (e) {
                console.log("Error Neo4j - creando co-evolve");
                console.log(query.join(' '));
                console.log(e);
            }
        }
    }
}