(function (global) {
	Ligue4Visao = new PrototipoUnico({
		inicializarUnico: function () {
			this.construirTabuleiro();
			this.observarTabuleiro();
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
					celulaDoTabuleiro.textContent = String.formatar("%@:%@", indiceDaLinha, indiceDaColuna);
					linhaDoTabuleiro.appendChild(templateCelulaDoTabuleiro.cloneNode(true));
				}
				tabuleiro.appendChild(templateLinhaDoTabuleiro.cloneNode(true));
				linhaDoTabuleiro.limpar();
			}
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
		}
	});
	
	global.Ligue4Visao = Ligue4Visao;
}(this));
