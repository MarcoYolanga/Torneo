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