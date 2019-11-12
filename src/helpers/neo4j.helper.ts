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

    /**
     * Save the commit relationships
     * @param commit 
     * @param files 
     */
    async saveCommit(commit:Commit, files) {
        if (files != null && files.length < 1) return;

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
                ` MERGE (class)-[r:CHANGED_IN]->(commit) `
            ];

            try {
                await this.run(relQuery.join(' '));
                savedFiles++;
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
}