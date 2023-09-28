var rlib = {
	setPage: (page) => {
		$('.page').removeClass('show');
		$('.page[data-page="' + page + '"]').addClass('show');
	},
	getPage: () => {
		return $('.page.show').data('page');
	},
	isSamePartita: (a, b) => {
		return (a.squadre[0] === b.squadre[0] && a.squadre[1] === b.squadre[1])
			|| (a.squadre[1] === b.squadre[0] && a.squadre[0] === b.squadre[1]);
	},
	isGiocata: (partita) => {
		return (partita.risultato[0] + partita.risultato[1]) > 0;
	},
	renderSquadraBadge: (squadra) => {
		return $('<div data-id="' + squadra.id + '" class="squadra badge bg-secondary">' + squadra.nome + '</div>');
	}
};
function _json_decode(str, def = {}) {
	if (str === undefined || str === null)
		return def;
	if (typeof str != "string")
		return str; //already decoded?
	let obj = def;
	if (str == "")
		return obj;
	try {
		obj = JSON.parse(str);
	} catch (error) {
		console.warn("Invalid json " + str);
	}
	return obj;
}
function _json_encode(obj) {
	if(typeof obj === 'string'){
		return obj;
	}
	return JSON.stringify(obj);
}
function _json_clone(obj){
	return _json_decode(_json_encode(obj));
}
function millis() {
	var d = new Date();
	return d.getTime();
}