/*global Classe*/
/*global Ligue4Controle*/
/*global Ligue4Modelo*/
/*global Linda*/
/*global Minimax*/

(function (global) {
	"use strict";

	var Ligue4Visao = Classe.criarSingleton({
		inicializar: function () {
			this.construirTabuleiro();
		},

		construirTabuleiro: function () {
			var tabuleiro = Linda.selecionar("table.tabuleiro");
			var templateLinhaDoTabuleiro = Linda.selecionar("template.linhaDoTabuleiro").content;
			var linhaDoTabuleiro = templateLinhaDoTabuleiro.selecionar("tr.linhaDoTabuleiro");
			var templateCelulaDoTabuleiro = linhaDoTabuleiro.selecionar("template.celulaDoTabuleiro").content;
			var quantidadeDeLinhas = Ligue4Modelo.instancia.quantidadeDeLinhas;
			var quantidadeDeColunas = Ligue4Modelo.instancia.quantidadeDeColunas;
			for (var indiceDaLinha = 0; indiceDaLinha < quantidadeDeLinhas; indiceDaLinha++) {
				for (var indiceDaColuna = 0; indiceDaColuna < quantidadeDeColunas; indiceDaColuna++) {
					linhaDoTabuleiro.appendChild(templateCelulaDoTabuleiro.cloneNode(true));
				}
				tabuleiro.appendChild(templateLinhaDoTabuleiro.cloneNode(true));
				linhaDoTabuleiro.limpar();
			}
		},

		construirArvoreMinimax: function (minimax) {
			var nodos = [minimax.raiz];
			var secaoArvore = Linda.selecionar("section.arvore");
			secaoArvore.limpar();
			var templateNodo = secaoArvore.selecionar("template.nodo").content;
			var divisaoNodo = templateNodo.selecionar("div.nodo");
			var tabelaTabuleiro = divisaoNodo.selecionar("table.tabuleiro");
			var alfaBeta = divisaoNodo.selecionar("p.alfaBeta");
			var jogador = divisaoNodo.selecionar("p.jogador");
			var templateLinhaDoTabuleiro = tabelaTabuleiro.selecionar("template.linhaDoTabuleiro").content;
			var linhaLinhaDoTabuleiro = templateLinhaDoTabuleiro.selecionar("tr.linhaDoTabuleiro");
			var templateCelulaDoTabuleiro = linhaLinhaDoTabuleiro.selecionar("template.celulaDoTabuleiro").content;
			var celulaCelulaDoTabuleiro = templateCelulaDoTabuleiro.selecionar("td.celulaDoTabuleiro");
			while (nodos.length > 0) {
				var nodoAtual = nodos.shift();
				this.construirTabuleiroDaArvoreMinimax(nodoAtual, celulaCelulaDoTabuleiro, linhaLinhaDoTabuleiro, tabelaTabuleiro, templateCelulaDoTabuleiro, templateLinhaDoTabuleiro);
				alfaBeta.textContent = String.formatar("%@/%@", nodoAtual.alfa, nodoAtual.beta);
				jogador.textContent = nodoAtual.jogador.nome;
				secaoArvore.appendChild(templateNodo.cloneNode(true));
				secaoArvore.appendChild(Linda.documento.createElement("hr"));
				nodos.fundir(nodoAtual.filhos);
				tabelaTabuleiro.limpar();
			}
		},

		construirTabuleiroDaArvoreMinimax: function (nodoAtual, celulaCelulaDoTabuleiro, linhaLinhaDoTabuleiro, tabelaTabuleiro, templateCelulaDoTabuleiro, templateLinhaDoTabuleiro) {
			nodoAtual.tabuleiro.celulas.paraCada(function (linha) {
				linha.paraCada(function (celula) {
					this.ocuparCelulaDoTabuleiroDaArvoreMinimax(celula, celulaCelulaDoTabuleiro, linhaLinhaDoTabuleiro, templateCelulaDoTabuleiro);
				}, this);
				tabelaTabuleiro.appendChild(templateLinhaDoTabuleiro.cloneNode(true));
				linhaLinhaDoTabuleiro.limpar();
			}, this);
		},

		ocuparCelulaDoTabuleiroDaArvoreMinimax: function (celula, celulaCelulaDoTabuleiro, linhaLinhaDoTabuleiro, templateCelulaDoTabuleiro) {
			if (celula.ocupada()) {
				celulaCelulaDoTabuleiro.classList.add(celula.ocupante.identificador);
			}
			linhaLinhaDoTabuleiro.appendChild(templateCelulaDoTabuleiro.cloneNode(true));
			if (celula.ocupada()) {
				celulaCelulaDoTabuleiro.classList.remove(celula.ocupante.identificador);
			}
		},

		observarJogadores: function () {
			var ordemDeJogadores = Ligue4Modelo.instancia.ordemDeJogadores;
			ordemDeJogadores.observarAtualizacao(this.atualizarJogadorDaVez.vincularEscopo(this), "0");
			this.atualizarJogadorDaVez(ordemDeJogadores);
		},

		observarTabuleiro: function () {
			this.observarCelulas();
		},

		observarCelulas: function () {
			var celulas = Ligue4Modelo.instancia.tabuleiro.celulas;
			celulas.paraCada(function (linha) {
				linha.paraCada(function (celula) {
					celula.observarAtualizacao(this.atualizarCelula.vincularEscopo(this), "ocupante");
				}, this);
			}, this);
		},

		observarNodos: function () {
			Minimax.observarAtualizacao(this.atualizarNodos.vincularEscopo(this));
		},

		atualizarNodos: function (minimax, propriedade) {
			var nodos = Linda.selecionar(String.formatar("section.estatisticas > dl > dd.%@", propriedade));
			nodos.textContent = minimax[propriedade];
		},

		atualizarContagemDosNodos: function () {
			Linda.selecionar("section.estatisticas > dl > dd.nodosConstruidos").textContent = Minimax.nodosConstruidos;
			Linda.selecionar("section.estatisticas > dl > dd.nodosProcessados").textContent = Minimax.nodosProcessados;
			Linda.selecionar("section.estatisticas > dl > dd.totalDeNodosConstruidos").textContent = Minimax.totalDeNodosConstruidos;
			Linda.selecionar("section.estatisticas > dl > dd.totalDeNodosProcessados").textContent = Minimax.totalDeNodosProcessados;
		},

		atualizarCelula: function (celula) {
			var elementoCelula = Linda.selecionar("table.tabuleiro").rows[celula.linha].cells[celula.coluna];
			elementoCelula.classList.add(celula.ocupante.identificador);
		},

		atualizarJogadorDaVez: function (ordemDeJogadores) {
			var jogadorDaVez = ordemDeJogadores.primeiro;
			var itensJogadores = Linda.selecionarTodos("ul.jogadores > li");
			for (var indice = 0, tamanho = itensJogadores.length; indice < tamanho; indice++) {
				itensJogadores[indice].classList.remove("jogadorDaVez");
			}
			Linda.selecionar(String.formatar("ul.jogadores > li.%@", jogadorDaVez.identificador)).classList.add("jogadorDaVez");
		},

		declararVencedor: function (sequenciasVencedoras) {
			this.mostrarMensagem(String.formatar("O jogador %@ venceu.", sequenciasVencedoras.primeiro.primeiro.ocupante.nome));
		},

		declararEmpate: function () {
			this.mostrarMensagem("O jogo empatou. Ninguém venceu :-(");
		},

		declararColunaCheia: function () {
			this.mostrarMensagem("A coluna está cheia. Escolha outra.");
		},

		limparMensagem: function (secaoMensagem) {
			secaoMensagem = secaoMensagem || Linda.selecionar("section.mensagem");
			var mensagens = secaoMensagem.selecionarTodos("p.mensagem");
			mensagens.paraCada(function (mensagem) {
				mensagem.remove();
			});
		},

		mostrarMensagem: function (mensagem) {
			var secaoMensagem = Linda.selecionar("section.mensagem");
			var templateMensagem = Linda.selecionar("template.mensagem").content;
			this.limparMensagem(secaoMensagem);
			templateMensagem.selecionar("p.mensagem").textContent = mensagem;
			secaoMensagem.appendChild(templateMensagem.cloneNode(true));
			Ligue4Controle.instancia.adicionarTratadorDeMensagem();
		}
	});

	global.Ligue4Visao = Ligue4Visao;
}(this));
