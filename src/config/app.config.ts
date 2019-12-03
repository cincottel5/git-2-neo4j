export const config = {
    // funciona bien
    //repository_url: 'https://github.com/mongodb/mongo-csharp-driver.git',

    // funciona bien
    repository_url: 'https://github.com/JamesNK/Newtonsoft.Json.git',
    

    //repository_url: 'https://github.com/microsoft/nodejstools.git',


    file_log_url: 'public/log.txt',
    file_search_path: 'Src',
    
    regex_commit: /(^|\n)(commit+(?=\s{1}\w{40}\n))/g,
    regex_files: /\n([^\s])+(\.java|\.cs|\.js|\.rb){1}/g,

    regex_commit_id: /^(\s)?([\w]+)/g,
    regex_commit_author: /(?<=Author:).*/g,
    regex_commit_date: /(?<=Date:).*/g,
    regex_commit_comment: /(?<=\s{4}).*/g,

    regex_file_name: /[^\/|\r\n]+\.\w+$/,

    neo4j_host: '10.211.55.4',
    neo4j_port: '7687',
    neo4j_user: 'neo4j',
    neo4j_pass: 'cincottel', 

    // functiona bien
    //neo4j_project_id: 'MongoDB.C#.Driver',

    // Funciona bien
    neo4j_project_id: 'Json.NET',

    //neo4j_project_id: 'NodeJS.Tools',

    ignore_paths: [
        'src',
        'Src',
        'Tests',
        'tests'
    ]

}