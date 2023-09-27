export function FormController(el){
    el = $(el);
    if(el.hasClass('js-inited')){
        return;
    }
    let api = {
        el: el,
        read: function(){
            let payload = {};

            el.find('.form-control').each(function(){
                const inp = $(this);
                let value = inp.val();
                //convert bool
                if(value === 'true'){
                    value = true;
                }
                if(value === 'false'){
                    value = false;
                }
                //convert numbers
                if(inp.attr('type') === 'number'){
                    value = parseFloat(value);
                }

                payload[inp.attr('name')] = value;
            });

            
            
            $('.external-form-control').each(function(){
                const inp = $(this);
                payload[inp.attr('name')] = inp.val();
            });
            return payload;
        },
        setLoading: function(toggle) {
            this.el.find('button[type="submit"], button[type="button"]').prop('disabled', toggle);
        }
    };

    

    el.data('api', api);
    return api;
};