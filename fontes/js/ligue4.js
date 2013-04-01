(function () {
	Ligue4 = new PrototipoUnico({
		inicializarUnico: function () {
			new TratadorDePagina().paraCarregamento(this.inicializarModulos.vincularEscopo(this));
		},
		
		inicializarModulos: function () {
			Ligue4Modelo.instancia();
			Ligue4Visao.instancia();
			Ligue4Controle.instancia();
		}
	});
	Ligue4.instancia();
}());
