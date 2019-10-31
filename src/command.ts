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
}