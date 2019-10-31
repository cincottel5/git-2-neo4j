export class File {
    name;
    qualifiedname;

    constructor(fileTxt, baseUrl=''){
        fileTxt = fileTxt.replace('|', '').trim();

        let realName =  fileTxt.split(/(\/src\/)/)||[];
        realName = realName[realName.length-1];
    }
}