(function (global) {
	Ligue4Ia = new PrototipoUnico({
		inicializarUnico: function () {
			EstrategiaMinimax.fixarEstrategia(Minimax);
			this.construirArvore = true;
			this.profundidade = 2;
		},

		receberJogada: function (ordemDeJogadores) {
			if (ordemDeJogadores.primeiro().igual(Ligue4Modelo.instancia.jogadores.computador)) {
				var tabuleiro = Ligue4Modelo.instancia.tabuleiro.clonar();
				var ordemDeJogadores = Ligue4Modelo.instancia.ordemDeJogadores.clonar();
				EstrategiaMinimax.reiniciarNodosConstruidosProcessados();
				var minimax = new EstrategiaMinimax(tabuleiro, ordemDeJogadores);
				minimax.construirArvore(ordemDeJogadores, this.profundidade);
				var jogada = minimax.jogar();
				Ligue4Modelo.instancia.jogarComputador(jogada.coluna);
				if (this.construirArvore) {
					Ligue4Visao.instancia.construirArvoreMinimax(minimax);
				}
			}
		}
	});
	

	Minimax = new Prototipo({
		inicializar: function (tabuleiro, ordemDeJogadores) {
			this.raiz = new Nodo(tabuleiro, ordemDeJogadores.ultimo());
			this.nodoAtual = this.raiz;
		},

		construirArvore: function (ordemDeJogadores, profundidade) {
			this.raiz.construirSubArvore(ordemDeJogadores, profundidade);
			this.raiz.calcularMaximo();
		},

		jogar: function () {
			var proximoPasso = this.nodoAtual.nodoAlfa;
			var jogada = proximoPasso.tabuleiro.ultimaJogada;
			this.receberJogada(jogada);
			return jogada;
		},

		receberJogada: function (celula) {
			this.nodoAtual = this.nodoAtual.fornecerProximoPasso(celula);
		}
	});

	EstrategiaMinimax = new Prototipo({});

	EstrategiaMinimax.estender({
		nodosConstruidos: 0,
		nodosProcessados: 0,
		totalDeNodosConstruidos: 0,
		totalDeNodosProcessados: 0,

		reiniciarNodosConstruidosProcessados: function () {
			this.nodosConstruidos = 0;
			this.nodosProcessados = 0;
		},

		fixarEstrategia: function (Estrategia) {
			this.implementar(Estrategia.prototype);
		}
	});

	Nodo = new Prototipo({
		inicializar: function (tabuleiro, jogador) {
			this.alfa = Number.menosInfinito;
			this.beta = Number.maisInfinito;
			this.nodoAlfa = null;
			this.nodoBeta = null;
			this.tabuleiro = tabuleiro;
			this.jogador = jogador;
			this.filhos = [];
			EstrategiaMinimax.totalDeNodosConstruidos++;
			EstrategiaMinimax.nodosConstruidos++;
		},

		construirSubArvore: function (ordemDeJogadores, profundidade) {
			if (profundidade > 0) {
				var jogadasPossiveis = this.tabuleiro.fornecerJogadasPossiveis();
				var novaOrdemDeJogadores = ordemDeJogadores.clonar();
				var jogadorDaVez = ordemDeJogadores.primeiro();
				var novaProfundidade = profundidade - 1;
				novaOrdemDeJogadores.push(novaOrdemDeJogadores.shift());
				jogadasPossiveis.paraCada(function (celula) {
					var tabuleiroClone = this.tabuleiro.clonar();
					tabuleiroClone.receberJogada(celula.coluna, jogadorDaVez);
					var nodoFilho = new Nodo(tabuleiroClone, jogadorDaVez);
					this.adicionarFilho(nodoFilho);
					nodoFilho.construirSubArvore(novaOrdemDeJogadores, novaProfundidade);
				}, this);
			}
		},

		calcularMinimo: function () {
			EstrategiaMinimax.nodosProcessados++;
			EstrategiaMinimax.totalDeNodosProcessados++;
			if (this.filhos.vazio()) {
				this.beta = this.calcularPontuacao();
				return this.beta;
			}
			var primeiroFilho = this.filhos.primeiro();
			primeiroFilho.calcularMaximo();
			this.nodoBeta = this.filhos.reduzirSemPrimeiro(function (nodoEscolhido, nodoAtual) {
				return (nodoAtual.calcularMaximo() < nodoEscolhido.alfa) ? nodoAtual : nodoEscolhido;
			}, primeiroFilho, this);
			this.beta = this.nodoBeta.alfa;
			return this.beta;
		},

		calcularMaximo: function () {
			EstrategiaMinimax.nodosProcessados++;
			EstrategiaMinimax.totalDeNodosProcessados++;
			if (this.filhos.vazio()) {
				this.alfa = this.calcularPontuacao();
				return this.alfa;
			}
			var primeiroFilho = this.filhos.primeiro();
			primeiroFilho.calcularMinimo();
			this.nodoAlfa = this.filhos.reduzirSemPrimeiro(function (nodoEscolhido, nodoAtual) {
				return (nodoAtual.calcularMinimo() > nodoEscolhido.beta) ? nodoAtual : nodoEscolhido;
			}, primeiroFilho, this);
			this.alfa = this.nodoAlfa.beta;
			return this.alfa;
		},

		calcularPontuacao: function () {
			return this.calcularCondicaoDeVitoria();
		},

		calcularCondicaoDeVitoria: function () {
			if (this.tabuleiro.possuiSequenciaVencedora()) {
				var vencedorDesejado = Ligue4Modelo.instancia.jogadores.computador;
				var computadorVenceu = this.tabuleiro.fornecerSequenciasVencedoras().primeiro().primeiro().ocupanteIgual(vencedorDesejado);
				return (computadorVenceu) ? 1 : -1 ;
			} else {
				return 0;
			}
		},

		adicionarFilho: function (nodo) {
			this.filhos.push(nodo);
		},

		fornecerProximoPasso: function (jogada) {
			var proximoPasso = null;
			this.filhos.paraCada(function (nodoFilho) {
				if (nodoFilho.tabuleiro.ultimaJogadaFoi(jogada)) {
					proximoPasso = nodoFilho;
					return;
				}
			});
			return proximoPasso;
		}
	});

	NodoDeHeuristica = new Prototipo({
		calcularPontuacao: function () {
			return (this.calcularCondicaoDeVitoria() + this.calcularHeuristica);
		},

		calcularHeuristica: function (valorInicial) {
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
		}
	});

	global.Ligue4Ia = Ligue4Ia;
	global.EstrategiaMinimax = EstrategiaMinimax;
	global.Minimax = Minimax;
}(this));
