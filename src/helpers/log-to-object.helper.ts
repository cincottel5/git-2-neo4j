import { Commit } from '../models/commit';
import { config } from '../config/app.config';

export class LogToObject {
    /**
     * Return all commits
     */
    static getCommits() {
        let commits = [];

        require('fs')
        .readFileSync(config.file_log_url, 'utf-8')
        .split(config.regex_commit).forEach(async function(commit){
            commit = commit.trim();
            if (commit == '' || commit == 'commit') return;

            let newCommit = new Commit(commit);
            
            if (newCommit.files.length > 0) {
                commits.push(newCommit);
            }
            
        });

        return commits;
    }
}