(function (global) {
	Ligue4Ia = new PrototipoUnico({
		inicializarUnico: function () {
			Ligue4Modelo.instancia.ordemDeJogadores.observarAtualizacao(this.jogar.vincularEscopo(this));
			this.minimax = new Minimax(new Nodo(Ligue4Modelo.instancia.tabuleiro.clonar()), 10);
		},

		jogar: function (ordemDosJogadores) {
			// Ligue4Modelo.instancia.jogarComputador();
			// TODO
		}
	});
	
	Minimax = new Prototipo({
		inicializar: function (raiz, profundidade) {
			this.raiz = raiz;
			this.nodoAtual = this.raiz;
			this.profundidade = profundidade;
			this.construirArvore();
		},

		construirArvore: function (profundidade) {
			
		},

		expandirArvore: function (profundidade) {
			
		}
	});

	Nodo = new Prototipo({
		inicializar: function (tabuleiro, jogador) {
			this.alfa = Number.maisInfinito;
			this.beta = Number.menosInfinito;
			this.tabuleiro = tabuleiro;
			this.jogador = jogador;
			this.filhos = [];
		},

		calcularMinimo: function () {
			
		},

		calcularMaximo: function () {
			
		},

		calcularHeuristica: function (valorInicia) {
			var jogadasPossiveis = this.tabuleiro.fornecerJogadasPossiveis();
			var heuristica = jogadasPossiveis.reduzir(function (valorDaHeuristica, celula) {
				var sequenciasPossiveisDeVitoria = celula.fornecerSequenciasPossiveisDeVitoria(this.jogador);
				var heuristicaDasSequencias = sequenciasPossiveisDeVitoria.reduzir(function (valorDaHeuristicaDasSequencias, sequencia) {
					var heuristicaDaSequencia = sequencia.reduzir(function (valorDaHeuristicaDaSequencia, celula) {
						return (celula.ocupada()) ? (valorDaHeuristicaDaSequencia + 1) : valorDaHeuristicaDaSequencia;
					}, 1);
					return (valorDaHeuristicaDasSequencias + heuristicaDaSequencia);
				}, 0);
				return (valorDaHeuristica + heuristicaDasSequencias);
			}, 0);
		},

		adicionarFilho: function (nodo) {
			this.filhos.push(nodo);
		}
	});

	global.Ligue4Ia = Ligue4Ia;
}(this));
