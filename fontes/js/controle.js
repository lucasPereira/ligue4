(function (global) {
	Ligue4Controle = new PrototipoUnico({
		inicializarUnico: function () {
			this.adicionarTratadores();
		},

		adicionarTratadores: function () {
			var tabuleiro = Linda.selecionar("table.tabuleiro");
			tabuleiro.rows.paraCada(function (linha) {
				linha.cells.paraCada(function (celula) {
					celula.tratadorDeClique(this.jogar.vincularEscopo(this));
				}, this);
			}, this);
			Linda.selecionar("section.configuracoes button.iniciarIa").tratadorDeClique(this.iniciarIa.vincularEscopo(this));
		},

		adicionarTratadorDeMensagem: function (mesagem) {
			Linda.selecionar("section.mensagem > p.mensagem").tratadorDeClique(this.fecharMensagem.vincularEscopo(this));
		},

		removerTratadores: function () {
			//TODO
		},

		iniciarIa: function () {
			Linda.selecionar("section.configuracoes button.iniciarIa").disabled = true;
			var estrategias = Linda.obterTodosPeloNome("estrategiaMinimax");
			var estrategiaEscolhida;
			for (var indice = 0, tamanho = estrategias.length; indice < tamanho; indice++) {
				var estrategiaAtual = estrategias[indice];
				if (estrategiaAtual.checked) {
					estrategiaEscolhida = estrategiaAtual;
				}
			}
			var profundidade = Linda.obterPeloNome("profundidade").value.paraInteiro();
			var construirArvore = false;
			if (Linda.obterPeloNome("construirArvore").checked) {
				construirArvore = true;
			}
			estrategiaEscolhida = estrategiaEscolhida.value;
			if (estrategiaEscolhida === "minimax") {
				EstrategiaMinimax.fixarEstrategia(Minimax);
			} else if (estrategiaEscolhida === "minimaxComHeuristica") {
				EstrategiaMinimax.fixarEstrategia(MinimaxComHeuristica);
			} else if (estrategiaEscolhida === "minimaxComHeuristicaComPoda") {
				EstrategiaMinimax.fixarEstrategia(MinimaxComHeuristicaComPoda);
			}
			Ligue4Ia.instancia.profundidade = profundidade;
			Ligue4Ia.instancia.construirArvore = construirArvore;
			Ligue4Ia.instancia.receberJogada(Ligue4Modelo.instancia.ordemDeJogadores);
		},

		jogar: function (evento) {
			Ligue4Modelo.instancia.jogarHumano(evento.target.cellIndex);
		},

		fecharMensagem: function () {
			Ligue4Visao.instancia.limparMensagem();
		}
	});

	global.Ligue4Controle = Ligue4Controle;
}(this));
