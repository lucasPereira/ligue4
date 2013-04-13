/*global Classe*/
/*global Ligue4Modelo*/

(function (global) {
	"use strict";

	var Ligue4Ia = Classe.criarSingleton({
		inicializar: function () {
			EstrategiaMinimax.fixarEstrategia(Minimax);
			EstrategiaMinimax.fixarVencedorDesejado(Ligue4Modelo.instancia.jogadores.computador);
			this.construirArvore = false;
			this.profundidade = 4;
		},

		receberJogada: function (ordemDeJogadores) {
			if (ordemDeJogadores.primeiro.igual(EstrategiaMinimax.vencedorDesejado)) {
				EstrategiaMinimax.reiniciarNodosProcessados();
				var tabuleiro = Ligue4Modelo.instancia.tabuleiro;
				var minimax = new Minimax(tabuleiro, ordemDeJogadores, this.profundidade);
				var jogada = minimax.jogar();
				Ligue4Modelo.instancia.jogarComputador(jogada);
			}
		}
	});

	var Minimax = Classe.criar({
		inicializar: function (tabuleiro, ordemDeJogadores, profundidadeMaxima) {
			this.profundidadeMaxima = profundidadeMaxima;
			this.maximo = this.calcularMaximo(new Nodo(Number.menosInfinito), new Nodo(Number.maisInfinito), tabuleiro, ordemDeJogadores, 1);
		},

		calcularMaximo: function (alfa, beta, tabuleiro, ordemDeJogadores, profundidade) {
			EstrategiaMinimax.processarNodo();
			var jogadasPossiveis = tabuleiro.fornecerJogadasPossiveis();
			if (profundidade >= this.profundidadeMaxima || jogadasPossiveis.vazio()) {
				EstrategiaMinimax.processarNodoFolha();
				return new Nodo(this.calcularPontuacao(tabuleiro, profundidade), tabuleiro.ultimaJogada);
			}
			var novaOrdemDeJogadores = ordemDeJogadores.clonar();
			var novaProfundidade = (profundidade + 1);
			novaOrdemDeJogadores.push(novaOrdemDeJogadores.shift());
			for (var indice = 0, tamanho = jogadasPossiveis.length; indice < tamanho; indice++) {
				var novoTabuleiro = tabuleiro.clonar();
				var jogada = jogadasPossiveis[indice];
				novoTabuleiro.receberJogada(jogada.coluna, novaOrdemDeJogadores.ultimo);
				var minimo = this.calcularMinimo(alfa, beta, novoTabuleiro, novaOrdemDeJogadores, novaProfundidade);
				if (minimo.maiorQue(alfa)) {
					alfa = minimo;
					alfa.fixarJogadaMaxima(jogada);
				}
				if (this.podar(alfa, beta)) {
					return alfa;
				}
			}
			return alfa;
		},

		calcularMinimo: function (alfa, beta, tabuleiro, ordemDeJogadores, profundidade) {
			EstrategiaMinimax.processarNodo();
			var jogadasPossiveis = tabuleiro.fornecerJogadasPossiveis();
			if (profundidade >= this.profundidadeMaxima || jogadasPossiveis.vazio()) {
				EstrategiaMinimax.processarNodoFolha();
				return new Nodo(this.calcularPontuacao(tabuleiro, profundidade), tabuleiro.ultimaJogada);
			}
			var novaOrdemDeJogadores = ordemDeJogadores.clonar();
			var novaProfundidade = (profundidade + 1);
			novaOrdemDeJogadores.push(novaOrdemDeJogadores.shift());
			for (var indice = 0, tamanho = jogadasPossiveis.length; indice < tamanho; indice++) {
				var novoTabuleiro = tabuleiro.clonar();
				novoTabuleiro.receberJogada(jogadasPossiveis[indice].coluna, novaOrdemDeJogadores.ultimo);
				var maximo = this.calcularMaximo(alfa, beta, novoTabuleiro, novaOrdemDeJogadores, novaProfundidade);
				if (maximo.menorQue(beta)) {
					beta = maximo;
				}
				if (this.podar(alfa, beta)) {
					return beta;
				}
			}
			return beta;
		},

		calcularPontuacao: function (tabuleiro, profundidade) {
			return this.calcularFuncaoDeUtilidade(tabuleiro, profundidade);
		},

		calcularFuncaoDeUtilidade: function (tabuleiro, profundidade) {
			if (tabuleiro.possuiSequenciaVencedora()) {
				var jogadorDesejadoVenceu = tabuleiro.fornecerSequenciasVencedoras().primeiro.primeiro.ocupanteIgual(EstrategiaMinimax.vencedorDesejado);
				return ((this.profundidadeMaxima - profundidade + 1) * ((jogadorDesejadoVenceu) ? 1 : -1));
			} else {
				return 0;
			}
		},

		podar: function () {
			return false;
		},

		jogar: function () {
			return this.maximo.jogadaMaxima.coluna;
		}
	});

	var MinimaxComPoda = Classe.criar({
		estende: Minimax,

		inicializar: function (tabuleiro, ordemDeJogadores, profundidade) {
			Minimax.prototipo.inicializar.chamarComEscopo(this, tabuleiro, ordemDeJogadores, profundidade);
		},

		podar: function (alfa, beta) {
			return (alfa.maiorOuIgualQue(beta));
		}
	});

	var MinimaxComHeuristica = Classe.criar({
		estende: MinimaxComPoda,

		inicializar: function (tabuleiro, ordemDeJogadores, profundidade) {
			MinimaxComPoda.prototipo.inicializar.chamarComEscopo(this, tabuleiro, ordemDeJogadores, profundidade);
		},

		calcularPontuacao: function (tabuleiro, profundidade) {
			return this.calcularFuncaoDeUtilidade(tabuleiro, profundidade);
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

	var EstrategiaMinimax = Classe.criar({});

	EstrategiaMinimax.estender({
		nodosFolhasProcessados: 0,
		nodosProcessados: 0,
		totalDeNodosFolhasProcessados: 0,
		totalDeNodosProcessados: 0,
		vencedorDesejado: null,

		fixarEstrategia: function (estrategia) {
			this.implementar(estrategia.prototipo);
		},

		fixarVencedorDesejado: function (vencedorDesejado) {
			this.vencedorDesejado = vencedorDesejado;
		},

		reiniciarNodosProcessados: function () {
			this.nodosFolhasProcessados = 0;
			this.nodosProcessados = 0;
		},

		processarNodo: function () {
			this.nodosProcessados++;
			this.totalDeNodosProcessados++;
		},

		processarNodoFolha: function () {
			this.nodosFolhasProcessados++;
			this.totalDeNodosFolhasProcessados++;
		}
	});

	var Nodo = Classe.criar({
		inicializar: function (pontuacao, jogada) {
			this.pontuacao = pontuacao;
			this.jogada = jogada;
		},

		maiorQue: function (outro) {
			return (this.pontuacao > outro.pontuacao);
		},

		menorQue: function (outro) {
			return (this.pontuacao < outro.pontuacao);
		},

		maiorOuIgualQue: function (outro) {
			return (this.pontuacao >= outro.pontuacao);
		},

		fixarJogadaMaxima: function (jogadaMaxima) {
			this.jogadaMaxima = jogadaMaxima;
		}
	});

	global.EstrategiaMinimax = EstrategiaMinimax;
	global.Ligue4Ia = Ligue4Ia;
	global.Minimax = Minimax;
	global.MinimaxComPoda = MinimaxComPoda;
	global.MinimaxComHeuristica = MinimaxComHeuristica;
}(this));
