import { File } from './file';
import { config } from '../config/app.config';

export class Commit {
    id: string;
    author: string;
    date: string;
    files: any[];
    comment;

    constructor(commitTxt) {
        this.files = [];

        try {
            this.id = commitTxt.match(config.regex_commit_id)[0].trim();
            this.author = commitTxt.match(config.regex_commit_author)[0].trim();
            this.date = commitTxt.match(config.regex_commit_date)[0].trim();
            this.comment = commitTxt.match(config.regex_commit_comment)[0].trim();
        }
        catch (e) {
            console.log("COMMIT Error");
            console.log(commitTxt);
            //throw e;
        }
        
        let files = commitTxt.match(config.regex_files)||[];

        for (let f of files) {
            if (f.trim() == "") continue;
            //if (f.indexOf(config.file_search_path) < 0) continue;

            try {
                this.files.push(new File(f));
            }
            catch (e) {
                console.log("ERROR File");
                console.log(f);
                // throw e;
            }
            
        }
    }
}