const fs = require('fs');
const appRootDir = require('app-root-dir');
const arrayUtils = require('./utils/arrayUtils');

class Translate  {

    /**
     * 
     * @param {String} locale : local code to load, ex : 'fr-fr'. If not found, default locale is loaded
     */
    _loadLocaleFile(locale) {
        let locales = {};
        try {
            locales = require(`${this.localesDir}/${locale}.json`);
        }catch(error) {
            console.warn(`Failed to load locale file : ${locale}.json. Loading default file : ${this.defaultLocale}`)
            //console.warn(error);
            locales = require(`${this.localesDir}/${this.defaultLocale}.json`);
        }
        return locales;
    }

    constructor() {
        this.localesDir = appRootDir.get()+'/locales';
        this.defaultLocale = "fr-fr";
    }

    /**
     * 
     * @param {Object} configuration : default_locale to update default locale
     *  
     */
    config(configuration) {
        if(!configuration) return;

        if(configuration.default_locale)  {
            if(fs.existsSync(`${this.localesDir}/${configuration.default_locale}.json`))
                this.defaultLocale = configuration.default_locale;
            else 
                console.warn(`${configuration.default_locale}.json does not exist !`)
        }
        if(configuration.locales_directory) {
            const _dir = appRootDir.get()+'/'+configuration.locales_directory;
            if(fs.existsSync(_dir) && fs.existsSync(`${_dir}/${this.defaultLocale}.json`))
                this.localesDir = _dir;
            else 
                console.warn(`${_dir} is not valid. Directory does not exist, or does not contains any json file`)
        }
    }

    init(locale) {
        console.log("Initializing i18n with lang:"+locale);
        const lang = locale.indexOf('-')!==-1?locale:`${locale}-${locale}`;

        const locales = this._loadLocaleFile(lang);
        
        return (key, params) => {
            const value = locales[key];
    
            let output = "";
    
            if(!value) return key;
            else if (!Array.isArray(value)) output=value;
            else output=arrayUtils.shuffle(value)[0];
    
            if(!params) return output;
    
            const keys = Object.keys(params);
            keys.forEach(paramKey => {
                while(output.indexOf(`{{${paramKey}}}`) !== -1)
                    output = output.replace(`{{${paramKey}}}`,params[paramKey]);
            })
    
            return output;
        }; 
    }
}

module.exports = new Translate();

