(function (global) {
	Ligue4Controle = new PrototipoUnico({
		inicializarUnico: function () {
			this.adicionarTratadores();
		},
		
		adicionarTratadores: function () {
			var tabuleiro = Linda.selecionar("table.tabuleiro");
			tabuleiro.rows.paraCada(function (linha) {
				linha.cells.paraCada(function (celula) {
					celula.tratadorDeClique(this.selecionarCelula.vincularEscopo(this));
				}, this);
			}, this);
		},
		
		adicionarTratadorDeMensagem: function (mesagem) {
			Linda.selecionar("section.mensagem > p.mensagem").tratadorDeClique(this.fecharMensagem.vincularEscopo(this));
		},
		
		removerTratadores: function () {
			//TODO
		},
		
		selecionarCelula: function (evento) {
			// if (Ligue4Modelo.instancia.humanoPodeJogar()) {
			// 	Ligue4Modelo.instancia.jogar(evento.target.cellIndex);
			// }
			Ligue4Modelo.instancia.jogar(evento.target.cellIndex);
			//TODO: Recolocar IF.
		},
		
		fecharMensagem: function () {
			Ligue4Visao.instancia.limparMensagem();
		}
	});
	
	global.Ligue4Controle = Ligue4Controle;
}(this));
