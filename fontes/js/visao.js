(function (global) {
	Ligue4Visao = new PrototipoUnico({
		inicializarUnico: function () {
			this.construirTabuleiro();
			this.observarTabuleiro();
			this.observarJogadores();
		},
		
		construirTabuleiro: function () {
			var tabuleiro = Linda.selecionar("table.tabuleiro");
			var templateLinhaDoTabuleiro = Linda.selecionar("template.linhaDoTabuleiro").content;
			var linhaDoTabuleiro = templateLinhaDoTabuleiro.selecionar("tr.linhaDoTabuleiro");
			var templateCelulaDoTabuleiro = linhaDoTabuleiro.selecionar("template.celulaDoTabuleiro").content;
			var celulaDoTabuleiro = templateCelulaDoTabuleiro.selecionar("td.celulaDoTabuleiro");
			var quantidadeDeLinhas = Ligue4Modelo.instancia.quantidadeDeLinhas;
			var quantidadeDeColunas = Ligue4Modelo.instancia.quantidadeDeColunas;
			for (var indiceDaLinha = 0; indiceDaLinha < quantidadeDeLinhas; indiceDaLinha++) {
				for (var indiceDaColuna = 0; indiceDaColuna < quantidadeDeColunas; indiceDaColuna++) {
					// celulaDoTabuleiro.textContent = String.formatar("%@:%@", indiceDaLinha, indiceDaColuna);
					// TODO
					linhaDoTabuleiro.appendChild(templateCelulaDoTabuleiro.cloneNode(true));
				}
				tabuleiro.appendChild(templateLinhaDoTabuleiro.cloneNode(true));
				linhaDoTabuleiro.limpar();
			}
		},
		
		observarJogadores: function () {
			var ordemDeJogadores = Ligue4Modelo.instancia.ordemDeJogadores;
			ordemDeJogadores.observarAtualizacao(this.atualizarJogadorDaVez.vincularEscopo(this));
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
		
		atualizarCelula: function (celula, propriedade, tipo, valorAntigo) {
			var elementoCelula = Linda.selecionar("table.tabuleiro").rows[celula.linha].cells[celula.coluna];
			elementoCelula.classList.add(celula.ocupante.identificador);
		},
		
		atualizarJogadorDaVez: function (ordemDeJogadores) {
			var jogadorDaVez = ordemDeJogadores.primeiro();
			var itensJogadores = Linda.selecionarTodos("ul.jogadores > li");
			for (var indice = 0, tamanho = itensJogadores.length; indice < tamanho; indice++) {
				itensJogadores[indice].classList.remove("jogadorDaVez");
			}
			Linda.selecionar(String.formatar("ul.jogadores > li.%@", jogadorDaVez.identificador)).classList.add("jogadorDaVez");
		},
		
		declararVencedor: function (sequenciasVencedoras) {
			this.mostrarMensagem(String.formatar("O jogador %@ venceu.", sequenciasVencedoras.primeiro().primeiro().ocupante.nome));
		},
		
		declararEmpate: function () {
			this.mostrarMensagem("O jogo empatou. Ninguém venceu :-(");
		},
		
		declararColunaCheia: function () {
			this.mostrarMensagem("A coluna está cheia. Escolha outra.");
		},
		
		limparMensagem: function (secaoMensagem) {
			var secaoMensagem = secaoMensagem || Linda.selecionar("section.mensagem");
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
