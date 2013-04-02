(function () {
	Ligue4 = new PrototipoUnico({
		inicializarUnico: function () {
			new TratadorDePagina().paraCarregamento(this.inicializarModulos.vincularEscopo(this));
		},
		
		inicializarModulos: function () {
			Ligue4Modelo.instancia();
			Ligue4Visao.instancia();
			Ligue4Controle.instancia();
		},
		
		declararVencedor: function (sequenciasVencedoras) {
			Ligue4Visao.instancia.declararVencedor(sequenciasVencedoras);
			Ligue4Controle.instancia.removerTratadores();
		},
		
		declararEmpate: function () {
			Ligue4Visao.instancia.declararEmpate();
			Ligue4Controle.instancia.removerTratadores();
			
		},
		
		declararColunaCheia: function () {
			Ligue4Visao.instancia.declararColunaCheia();
		}
	});
	Ligue4.instancia();
}());
