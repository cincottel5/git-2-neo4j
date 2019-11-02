import { config } from '../config/app.config';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export class Command{
    
    /**
     * Methods execute commands in arrayd
     * @param num 
     */
    static async execute(array, position = 0) {

        if (position > array.length-1) return;
    
        console.log("");
        console.log(`******Commando ${position+1}****`);
        
        const {stdout, stderr } = await exec(array[position]);
    
        console.log(array[position]);
    
        console.log("*************************")
        console.log("******* Finalizado ******");
    
        await this.execute(array, position+1)
    }

    static async createLog() {
        let firsStepCommands = [
            `rm ${config.file_log_url}`,
            'mkdir public/repo',
            `git clone ${process.argv[2]} ./public/repo`,
            `git --git-dir=public/repo/.git log --stat --name-only >> ${config.file_log_url}`,
            'rm -Rf public/repo'
        ];
    
        await Command.execute(firsStepCommands);
        console.log('Finalizó creación del log');
    }
}