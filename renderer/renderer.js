import { FormController } from '../include/form-controller.js';

var glo = {
    saveFile: null,
    setSaveFile: (val) => {
        glo.saveFile = val;
        if(val){
            $('#save-path').text(val);
        } else {
            $('#save-path').text('');
        }
    },
    db: {
        data: {},
        load: function (data) {
            console.log('json parse', data, _json_decode(data));
            this.data = _json_decode(data);
            this.val('last-open', millis());

            glo.squadre.render();
            glo.torneo.load();
        },
        save: function() {
            window.localAPI.saveFile(glo.saveFile, _json_encode(this.data));
        },
        val: function (k, v) {
            if(v === undefined){
                return this.data[k];
            }
            this.data[k] = v;
            this.save();
        },
        progressivo: function (k) {
            let prev = this.val('progressivo-'+k);
            if(!prev){
                prev = 0;
            }
            this.val('progressivo-'+k, prev+1);
            return prev+1;
        }
    },
    squadre: {
        form: null,
        table: null,
        listCache: null,
        add: function (squadra) {
            //TODO: check dupl
            console.log('adding ', squadra);
            const row = $('<tr><td>'+squadra.nome+'</td><td><button class="btn btn-danger btn-sm btn-delete">X</button></td></tr>');
            if(!squadra.id){
                squadra.id = glo.db.progressivo('squadre');
            }
            row.data('squadra', squadra);
            this.table.find('tbody').append(row);
            row.find('.btn-delete', function(){
                $(this).closest('tr').delete();
                glo.squadre.save();
            });
        },
        render: function () {
            const squadre = this.val();
            this.table.find("tbody tr").remove();
            for(const squadra of squadre){
                this.add(squadra);
            }
            
        },
        save: function () {
            this.val(this.read());
            this.listCache = null;
        },
        read: function () {
            let data = [];
            this.table.find('tbody tr').each(function(){
                const row = $(this);
                data.push(row.data('squadra'));
            });
            return data;
        },
        val: function(setVal) {
            if(setVal === undefined){
                return _json_decode(glo.db.val('squadre'), []);
            }
            glo.db.val('squadre', _json_encode(setVal));
        },
        list: function(){
            if(!this.listCache){
                const squadre = this.val();
                let map = {};
                for(const squadra of squadre){
                    map[squadra.id] = squadra;
                }
                this.listCache = map;
            }
            return this.listCache;
        },
    },
    torneo: {
        fasi: ['gironi-andata', 'gironi-ritorno', 'eliminatorie'],
        data: {},
        val: function(setVal) {
            if(setVal === undefined){
                return _json_decode(glo.db.val('torneo'));
            }
            glo.db.val('torneo', _json_encode(setVal));
        },
        start: function() {
            this.data = {
                options: {},
                partite: [], //indexFase => [partite]
            };
            const formOptions = this.nodes.startTorneo.read();
            if(!formOptions.gironi){
                throw new Error("Can't start torneo without config");
            }
            this.data.options = formOptions;
            this.setFase(0);
            
            //dividi i gironi
            const squadre = glo.squadre.list()
            const nSquadre = Object.keys(squadre).length;
            const nGironi = parseInt(this.data.options.gironi);
            const nPerGirone = Math.floor(nSquadre / nGironi);
            this.data.gironi = [];
            let indexGirone = 0;
            for(const idSquadra in squadre){
                const squadra = squadre[idSquadra];
                if(!this.data.gironi[indexGirone]){
                    this.data.gironi[indexGirone] = [];
                }
                this.data.gironi[indexGirone].push(squadra);
                if(this.data.gironi[indexGirone].length >= nPerGirone){
                    indexGirone++;
                }
            }
            //se l'ultimo girone è meno del necessario spalma i giocatori
            if(this.data.gironi[this.data.gironi.length - 1].length < nPerGirone){
                let girone = this.data.gironi.pop();
                indexGirone = 0;
                for(const squadra of girone){
                    this.data.gironi[indexGirone % this.data.gironi.length].push(squadra);
                    indexGirone++;
                }
            }


            this.render();
            this.save();
        },
        setFase: function(indexFase){
            this.data.step = 0;
            this.data.fase = indexFase;
        },
        load: function (){
            this.data = this.val();
            if(typeof this.data.step === 'undefined'){
                console.error("Loaded invalid torneo data");
                this.start();
                return;
            }

            this.nodes.startTorneo.write(this.data.options);

            this.render();
        },
        render: function(){
            //stato base dei gironi
            this.nodes.renderGironi.html("");
            for(const girone of this.data.gironi){
                const col = $('<div class="col-12 col-md-3"></div>');
                const item = $('<div class="girone"><div class="classifica"></div><div class="match"></div></div>');
                const classifica = item.find('.classifica');
                const match = item.find('.match');
                for(const squadra of girone){
                    const squadraNode = $('<div data-id="'+squadra.id+'" class="squadra badge bg-secondary">'+squadra.nome+'</div>');
                    classifica.append(squadraNode);
                }

                col.append(item);
                this.nodes.renderGironi.append(col);
            }
        },
        save: function(){
            this.val(this.data);
        },
        init: function(tab){
            this.nodes = {
                tab: $(tab)
            };
            this.nodes.faseGironi = this.nodes.tab.find('.fase-gironi');
            this.nodes.faseEliminatorie = this.nodes.tab.find('.fase-eliminatorie');
            this.nodes.renderGironi = this.nodes.tab.find('.fase-gironi .render-gironi');
            this.nodes.startTorneo = FormController('#start-torneo');
            
            const torneo = this;
            this.nodes.startTorneo.el.on('submit', function(){
                torneo.start();
            });
            
        }
    }

};
window.addEventListener('load', () => {
    rlib.setPage('select-save');

    glo.squadre.table = $('#squadre');
    glo.squadre.form = FormController('#add-squadra');
    glo.squadre.form.el.on('submit', function(){
        glo.squadre.add(glo.squadre.form.read());
        glo.squadre.save();
        glo.squadre.form.el[0].reset();
    });

    glo.torneo.init('#torneo');
    

    let page = $('.page[data-page="select-save"]');
    page.find('.btn-newfile').on('click', async function () {
        
        let defaultFilePath = glo.saveFile;

        if(!defaultFilePath){
            defaultFilePath ="";
        }
        const savePathSelection = await window.localAPI.choseSaveAs(defaultFilePath);
        if (!savePathSelection) {
            console.log("Save as path selection aborted");
            return;
        }
        if (!savePathSelection.filePath) {
            console.error("Save as path selection error: no path was returned by the system");
            return;
        }
        glo.setSaveFile(savePathSelection.filePath);
        glo.db.load("{}");
        rlib.setPage('game');
    });

    page.find('.btn-loadfile').on('click', async function () {
        

        const savePathSelection = await window.localAPI.openFile();
        if (!savePathSelection) {
            console.log("Save as path selection aborted");
            return;
        }
        if (!savePathSelection.filePath) {
            console.error("Save as path selection error: no path was returned by the system");
            return;
        }
       
        glo.setSaveFile(savePathSelection.filePath);
        console.log("CONTENT", savePathSelection);
        glo.db.load(savePathSelection.fileContent);
        rlib.setPage('game');
    });

    page = $('.page[data-page="game"]');
    page.find('.btn-close-file').on('click', function () {
        glo.setSaveFile(null);
        rlib.setPage('select-save');
    });
});