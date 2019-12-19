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
    
        await this.execute(array, position+1);
    }

    static async createLog() {
        let firsStepCommands = [

            /**
             * Comando para limpiar la carpeta public, en donde se
             * almacenara el repositorio y el archivo de historial
             */
            `rm -f ${config.file_log_url}`,

            /**
             * Se asegura que exista la carpeta public
             */
            'mkdir public/repo',

            /**
             * Realiza la descarga del codigo fuente del repositorio
             * remoto
             */
            `git clone ${config.repository_url} ./public/repo`,

            /**
             * Extrae la informacion del historial del repositorio
             */
            `git --git-dir=public/repo/.git log --stat --name-only >> ${config.file_log_url}`,

            /**
             * elimina el repositorio
             */
            'rm -Rf public/repo'
        ];
    
        await Command.execute(firsStepCommands);
        console.log('Finalizó creación del log');
    }
}