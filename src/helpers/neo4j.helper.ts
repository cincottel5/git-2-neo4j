import { config } from '../config/app.config';
import { Commit } from '../models/commit';
import { File } from '../models/file';

import { v1 as neo4j } from 'neo4j-driver';

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
    async searchFiles(commit: Commit, projectName= 'MongoDB.C#.Driver') {
        let q1 = `match (p:Project)-[:HAS_CLASS]->(c:Class) where p.id = '${projectName}' `;
        let qRet = ' return c';  

        let filesToSave = [];

        for (let file of commit.files) {
            let fQuery = `and c.name='${file.name}'`
            let query = "".concat(q1, fQuery, qRet);
            let result;

            try {
                //console.log(`QUERY: ${query}`)
                result = await this.run(query);
            }
            catch (e) {
                console.log("Error Neo4j");
                console.log(query);
                //throw e;
            }
            
            if (result.records.length == 1) {
                filesToSave.push(result.records[0]);

            } else if (result.records.length >= 2) {
                console.log('De varios');
                let maxCoincidence = 0;
                let maxRecord = result.records[0];

                if (file.words.size >= 1) {
                    console.log('entro al loop de words');
                    console.log(file.fullName);
                    console.log(file.words);
                    for (let r of result.records) {
                        console.log(r.get('c').properties.qualifiedname);
                        
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
                console.log('ganador:');
                console.log(maxRecord.get('c').properties.qualifiedname)
                filesToSave.push(maxRecord);
            } 
            // else {
            //     console.log(`no encontro nada`);
            // }

        }
        console.log(`commit: ${commit.id} - files to save: ${filesToSave.length}`);
        return filesToSave;
    }

    async saveCommit(commit, files) {
        if (files.length < 1) return;
        
         
    }
}