export class Commit {
    id: string;
    author: string;
    date: string;
    files = [];
    comment;

    constructor(commitTxt) {
        this.id = commitTxt.match(/^(\s)?([\w]+)/g)[0];
        this.author = commitTxt.match(/(?<=Author:).*/g)[0].trim();
        this.date = commitTxt.match(/(?<=Date:).*/g)[0].trim();
        this.comment = commitTxt.match(/(?<=\s{4}).*/g)[0].trim();

        let files = commitTxt.match(/(.)+(.java){1}(\s)*(\|)/g)||[];

        for (let f in files) {
            let split = f.split(/(\/src\/)/)||[];

            if (split.length < 1) continue;

            let fileString = split[split.length-1];
            fileString = fileString.replace(/(\/|\\)/g, '.');
            console.log('hola');
            // let realName =  f.split(/(\/src\/)/)||[];
            // realName = realName[realName.length-1];


        }
    }
}