import { config } from '../config/app.config';

export class File {
    /**
     * Attributes
     */
    name;
    fullName;
    words;

    /**
     * Constructor
     * @param fileTxt 
     * @param baseUrl 
     */
    constructor(fileTxt) {
        try {
            this.fullName = fileTxt.trim();
            this.name = (this.fullName.match(config.regex_file_name))[0];

            fileTxt = fileTxt.replace(this.name, '');

            this.name = this.name.replace(/\.\w+/, '');

            let filter = fileTxt
                .split(/\/|\./g)
                .map(f=>f.replace('\n', ''))
                .filter(f=> !config.ignore_paths.includes(f));
                

            filter.splice(-1,1);

            this.words = new Set(filter);
        }
        catch (e) {
            throw e;
        }
    }
}