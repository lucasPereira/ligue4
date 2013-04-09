(function () {
	Ligue4 = new PrototipoUnico({
		inicializarUnico: function () {
			new TratadorDePagina().paraCarregamento(this.inicializarModulos.vincularEscopo(this));
		},

		inicializarModulos: function () {
			Ligue4Modelo.instancia();
			Ligue4Visao.instancia();
			Ligue4Ia.instancia();
			Ligue4Controle.instancia();
			Ligue4Visao.instancia.atualizarJogadorDaVez(Ligue4Modelo.instancia.ordemDeJogadores);
		},

		atualizarCelula: function (celula) {
			Ligue4Visao.instancia.atualizarCelula(celula);
		},

		atualizarJogador: function (ordemDeJogadores) {
			Ligue4Visao.instancia.atualizarJogadorDaVez(ordemDeJogadores);
			Linda.janela.setTimeout(function () {
				Ligue4Ia.instancia.receberJogada(ordemDeJogadores);
			}, 0);
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
