
const lib = {
    escapeHtml: (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    filename: (path) => {
        if (!path) {
            return path;
        }
        let separator = "/";
        if (!path.includes(separator) && path.includes("\\")) {
            separator = "\\";
        }
        const splitted = path.split(separator);
        return splitted[splitted.length - 1];
    },
    initTooltips: function () {
        console.log('init tooltips', $('[data-toggle="tooltip"]:not(.has-tooltip)').tooltipster({
            contentAsHTML: true,
            theme: 'tooltipster-noir',
            maxWidth: 300,

        }).addClass('has-tooltip'));
    },
    getExt: function (fileName) {
        if (!fileName) {
            return fileName;
        }
        fileName = new String(fileName).trim().toLowerCase();
        const split = fileName.split(".");
        return split[split.length - 1];
    },
    millis: function () {
        var d = new Date();
        return d.getTime();
    },
    humanFileSize: function (size) {
        var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    },
    //https://stackoverflow.com/a/68673714/5078983
    /**
     * Converts milliseconds into greater time units as possible
     * @param {int} ms - Amount of time measured in milliseconds
     * @return {?Object} Reallocated time units. NULL on failure.
     */
    timeUnits: function (ms) {
        if (!Number.isInteger(ms)) {
            return null
        }
        /**
         * Takes as many whole units from the time pool (ms) as possible
         * @param {int} msUnit - Size of a single unit in milliseconds
         * @return {int} Number of units taken from the time pool
         */
        const allocate = msUnit => {
            const units = Math.trunc(ms / msUnit)
            ms -= units * msUnit
            return units
        }
        // Property order is important here.
        // These arguments are the respective units in ms.
        return {
            // weeks: allocate(604800000), // Uncomment for weeks
            giorni: allocate(86400000),
            ore: allocate(3600000),
            minuti: allocate(60000),
            secondi: allocate(1000),
            millisecondi: ms // remainder
        }
    },
    elenco: function (arr) {
        if(!arr){
            return "";
        }
        if(arr.length === 1){
            return arr[0];
        }
        const lastEl = arr.pop();
        return arr.join(', ') + " e "+ lastEl;
    },
    humanTime: function (ms) {
        const singolare = {
            giorni: 'giorno',
            ore: 'ora',
            minuti: 'minuto',
            secondi: 'secondo',
            millisecondi: 'millisecondo'
        };
        const units = this.timeUnits(ms);
        let displayUnits = [];
        for(let unitName in units){
            const value = units[unitName];
            if(!value){
                continue;
            }
            if(value === 1 && singolare[unitName]){
                unitName = singolare[unitName];
            }
            displayUnits.push(value+" "+unitName);
        }
        return this.elenco(displayUnits);
    }
};

export { lib };