/*global Classe*/
/*global Ligue4Modelo*/
/*global Ligue4Visao*/

(function (global) {
	"use strict";

	var Ligue4Ia = Classe.criarSingleton({
		inicializar: function () {
			EstrategiaNodo.fixarEstrategia(Nodo);
			Minimax.fixarVencedorDesejado(Ligue4Modelo.instancia.jogadores.computador);
			this.construirArvore = false;
			this.profundidade = 4;
		},

		receberJogada: function (ordemDeJogadores) {
			if (ordemDeJogadores.primeiro.igual(Minimax.vencedorDesejado)) {
				Minimax.reiniciarNodosConstruidosProcessados();
				var tabuleiro = Ligue4Modelo.instancia.tabuleiro.clonar();
				var minimax = new Minimax(tabuleiro, ordemDeJogadores);
				minimax.construirArvore(ordemDeJogadores, this.profundidade);
				var jogada = minimax.jogar();
				Ligue4Modelo.instancia.jogarComputador(jogada.coluna);
				if (this.construirArvore) {
					Ligue4Visao.instancia.construirArvoreMinimax(minimax);
				}
			}
		}
	});

	var Minimax = Classe.criar({
		inicializar: function (tabuleiro, ordemDeJogadores) {
			this.raiz = new EstrategiaNodo(tabuleiro, ordemDeJogadores.ultimo);
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

	Minimax.estender({
		nodosConstruidos: 0,
		nodosProcessados: 0,
		totalDeNodosConstruidos: 0,
		totalDeNodosProcessados: 0,
		vencedorDesejado: null,

		fixarVencedorDesejado: function (vencedorDesejado) {
			this.vencedorDesejado = vencedorDesejado;
		},

		reiniciarNodosConstruidosProcessados: function () {
			this.nodosConstruidos = 0;
			this.nodosProcessados = 0;
		}
	});

	var EstrategiaNodo = Classe.criar({});

	EstrategiaNodo.estender({
		fixarEstrategia: function (Estrategia) {
			this.implementar(Estrategia.prototype);
		}
	});

	var Nodo = Classe.criar({
		inicializar: function (tabuleiro, jogador) {
			this.alfa = Number.menosInfinito;
			this.beta = Number.maisInfinito;
			this.nodoAlfa = null;
			this.nodoBeta = null;
			this.tabuleiro = tabuleiro;
			this.jogador = jogador;
			this.filhos = [];
			this.profundidade = 0;
			Minimax.totalDeNodosConstruidos++;
			Minimax.nodosConstruidos++;
		},

		construirSubArvore: function (ordemDeJogadores, profundidade) {
			if (profundidade > 0) {
				var jogadasPossiveis = this.tabuleiro.fornecerJogadasPossiveis();
				var novaOrdemDeJogadores = ordemDeJogadores.clonar();
				var jogadorDaVez = ordemDeJogadores.primeiro;
				var novaProfundidade = (profundidade - 1);
				this.profundidade = profundidade;
				novaOrdemDeJogadores.push(novaOrdemDeJogadores.shift());
				jogadasPossiveis.paraCada(function (celula) {
					var tabuleiroClone = this.tabuleiro.clonar();
					tabuleiroClone.receberJogada(celula.coluna, jogadorDaVez);
					var nodoFilho = new EstrategiaNodo(tabuleiroClone, jogadorDaVez);
					this.adicionarFilho(nodoFilho);
					nodoFilho.construirSubArvore(novaOrdemDeJogadores, novaProfundidade);
				}, this);
			}
		},

		calcularMinimo: function () {
			Minimax.nodosProcessados++;
			Minimax.totalDeNodosProcessados++;
			if (this.nodoFolha()) {
				this.beta = this.calcularPontuacao();
				return this.beta;
			}
			var primeiroFilho = this.filhos.primeiro;
			primeiroFilho.calcularMaximo();
			this.nodoBeta = this.filhos.reduzirSemPrimeiro(function (nodoEscolhido, nodoAtual) {
				return (nodoAtual.calcularMaximo() < nodoEscolhido.alfa) ? nodoAtual : nodoEscolhido;
			}, primeiroFilho, this);
			this.beta = this.nodoBeta.alfa;
			return this.beta;
		},

		calcularMaximo: function () {
			Minimax.nodosProcessados++;
			Minimax.totalDeNodosProcessados++;
			if (this.nodoFolha()) {
				this.alfa = this.calcularPontuacao();
				return this.alfa;
			}
			var primeiroFilho = this.filhos.primeiro;
			primeiroFilho.calcularMinimo();
			this.nodoAlfa = this.filhos.reduzirSemPrimeiro(function (nodoEscolhido, nodoAtual) {
				return (nodoAtual.calcularMinimo() > nodoEscolhido.beta) ? nodoAtual : nodoEscolhido;
			}, primeiroFilho, this);
			this.alfa = this.nodoAlfa.beta;
			return this.alfa;
		},

		calcularPontuacao: function () {
			return this.calcularFuncaoDeUtilidade();
		},

		calcularFuncaoDeUtilidade: function () {
			if (this.tabuleiro.possuiSequenciaVencedora()) {
				var profundiadeMaxima = 42;
				var computadorVenceu = this.tabuleiro.fornecerSequenciasVencedoras().primeiro.primeiro.ocupanteIgual(Minimax.vencedorDesejado);
				return ((profundiadeMaxima - this.profundidade) * ((computadorVenceu) ? 1 : -1));
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
		},

		nodoFolha: function () {
			return this.filhos.vazio();
		}
	});

	var NodoComHeuristicaComPoda = Classe.criar({});

	var NodoComHeuristica = Classe.criar({
		estende: Nodo,

		inicializar: function (tabuleiro, jogador) {
			Nodo.prototipo.inicializar.chamarComEscopo(this, tabuleiro, jogador);
		},

		calcularPontuacao: function () {
			return (this.calcularFuncaoDeUtilidade() + this.calcularHeuristica);
		},

		calcularHeuristica: function () {
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
			return heuristica;
		}
	});

	global.EstrategiaNodo = EstrategiaNodo;
	global.Ligue4Ia = Ligue4Ia;
	global.Minimax = Minimax;
	global.Nodo = Nodo;
	global.NodoComHeuristica = NodoComHeuristica;
}(this));
