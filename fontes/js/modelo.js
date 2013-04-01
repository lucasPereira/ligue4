(function (global) {
	Ligue4Modelo = new PrototipoUnico({
		inicializarUnico: function () {
			this.quantidadeDeLinhas = 6;
			this.quantidadeDeColunas = 7;
			this.jogadores = {
				humano: new Jogador("Humano", "humano"),
				computador: new Jogador("Computador", "computador")
			};
			this.tabuleiro = new Tabuleiro(this.quantidadeDeLinhas, this.quantidadeDeColunas);;
			this.ordemDeJogadores = [this.jogadores.humano, this.jogadores.computador];
			//TODO: sortear posição
		},
		
		jogar: function (coluna) {
			var jogadorDaVez = this.ordemDeJogadores.primeiro();
			var jogadaRealizada = this.tabuleiro.receberJogada(coluna, jogadorDaVez);
			if (jogadaRealizada) {
				if (this.tabuleiro.possuiSequenciaVencedora()) {
					//TODO: Vencedor
					alert("Vencedor");
				} else if (this.tabuleiro.fimDeCelulas()) {
						//TODO: Fim de célula
						alert("Empate");
				}
				this.ordemDeJogadores.push(this.ordemDeJogadores.shift());
			} else {
				//TODO Fim de coluna
				alert("Coluna cheia");
			}
			return jogadaRealizada;
		}
	});
	
	Tabuleiro = new Prototipo({
		inicializar: function (quantidadeDeLinhas, quantidadeDeColunas) {
			this.sequenciasVencedoras = [];
			this.celulas = new Array(this.quantidadeDeLinhas);
			this.quantidadeDeLinhas = quantidadeDeLinhas;
			this.quantidadeDeColunas = quantidadeDeColunas;
			this.quantidadeDeLigacoes = 3;
			this.celulasOcupadas = 0;
			this.construirTabuleiro();
		},
		
		construirTabuleiro: function () {
			for (var indiceDaLinha = 0; indiceDaLinha < this.quantidadeDeLinhas; indiceDaLinha++) {
				this.celulas[indiceDaLinha] = new Array(this.quantidadeDeColunas);
				for (var indiceDaColuna = 0; indiceDaColuna < this.quantidadeDeColunas; indiceDaColuna++) {
					this.celulas[indiceDaLinha][indiceDaColuna] = new Celula(indiceDaLinha, indiceDaColuna, this);
				}
			}
		},
		
		receberJogada: function (indiceDaColuna, jogador) {
			var indiceDaLinha = this.celulas.ultimoIndice();
			var celulaLivre = null;
			var celulaAtual = this.fornecerPrimeiraCelulaDeBaixoNaColuna(indiceDaColuna);
			while (celulaAtual.ocupada() && celulaAtual.dentroDoTabuleiro()) {
				celulaAtual = celulaAtual.fornecerAdjacenteCima();
			}
			var jogadaPossivel = (celulaAtual.livre() && celulaAtual.dentroDoTabuleiro());
			if (jogadaPossivel) {
				celulaAtual.ocupar(jogador);
				this.celulasOcupadas++;
				this.verificarSequenciaVencedora(celulaAtual);
			}
			return jogadaPossivel;
		},
		
		fornecerPrimeiraCelulaDeCimaNaColuna: function (coluna) {
			return this.celulas.primeiro()[coluna];
		},
		
		fornecerPrimeiraCelulaDeBaixoNaColuna: function (coluna) {
			return this.celulas.ultimo()[coluna];
		},
		
		fornecerCelula: function (linha, coluna) {
			if (this.celulas.dentroDosLimites(linha) && this.celulas[linha].dentroDosLimites(coluna)) {
				return this.celulas[linha][coluna];
			}
			return new CelulaForaDoTabuleiro(this);
		},
		
		verificarSequenciaVencedora: function (ultimaCelulaOcupada) {
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.verificarSequenciasVencedoras());
		},
		
		possuiSequenciaVencedora: function () {
			return (!this.sequenciasVencedoras.vazio());
		},
		
		fornecerSequenciasVencedoras: function () {
			return this.sequenciasVencedoras;
		},
		
		fimDeCelulas: function () {
			return ((this.quantidadeDeLinhas * this.quantidadeDeColunas) === this.celulasOcupadas);
		}
	});
	
	Celula = new Prototipo({
		inicializar: function (linha, coluna, tabuleiro) {
			this.linha = linha;
			this.coluna = coluna;
			this.tabuleiro = tabuleiro;
			this.ocupante = null;
		},
		
		livre: function () {
			return (Linda.nulo(this.ocupante));
		},
		
		liberar: function () {
			this.ocupante = null;
		},
		
		ocupada: function () {
			return (!Linda.nulo(this.ocupante));
		},
		
		ocupar: function (jogador) {
			this.ocupante = jogador;
		},
		
		mesmoOcupante: function (celula) {
			return (this.ocupada() && celula.ocupada() && this.ocupante.igual(celula.ocupante));
		},
		
		verificarSequenciasVencedoras: function () {
			var quantidadeDeLigacoes = this.tabuleiro.quantidadeDeLigacoes;
			var sequenciasDeVitoria = [];
			var sequenciasVencedoras = [];
			sequenciasDeVitoria.push(this.fornecerAdjacentesVerticalCima(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesVerticalBaixo(quantidadeDeLigacoes))
			sequenciasDeVitoria.push(this.fornecerAdjacentesHorizontalEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesHorizontalDireita(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalCimaEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalCimaDireita(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalBaixoEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalBaixoDireita(quantidadeDeLigacoes));
			sequenciasDeVitoria.paraCada(function (sequenciaDeVitoria) {
				if (this.verificarSequenciaVencedora(sequenciaDeVitoria)) {
					sequenciaDeVitoria.unshift(this);
					sequenciasVencedoras.push(sequenciaDeVitoria);
				}
			}, this);
			return sequenciasVencedoras;
		},
		
		verificarSequenciaVencedora: function (sequencia) {
			var possuiVencedora = true;
			sequencia.paraCada(function (celula) {
			if (!this.mesmoOcupante(celula)) {
					possuiVencedora = false;
					return;
				}
			}, this);
			return (possuiVencedora && (sequencia.length >= this.tabuleiro.quantidadeDeLigacoes));
		},
		
		fornecerAdjacenteCima: function () {
			return this.fornecerAdjacentes(-1, 0 ,1, true).primeiro();
		},
		
		fornecerAdjacenteBaixo: function () {
			return this.fornecerAdjacentes(1, 0 ,1, true).primeiro();
		},
		
		fornecerAdjacenteEsquerda: function () {
			return this.fornecerAdjacentes(0, -1 ,1, true).primeiro();
		},
		
		fornecerAdjacenteDireita: function () {
			return this.fornecerAdjacentes(0, 1 ,1, true).primeiro();
		},
		
		fornecerAdjacentesVerticalCima: function (quantidade) {
			return this.fornecerAdjacentes(-1, 0, quantidade, false);
		},
		
		fornecerAdjacentesVerticalBaixo: function (quantidade) {
			return this.fornecerAdjacentes(1, 0, quantidade, false);
		},
		
		fornecerAdjacentesHorizontalEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(0, -1, quantidade, false);
		},
		
		fornecerAdjacentesHorizontalDireita: function (quantidade) {
			return this.fornecerAdjacentes(0, 1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalCimaEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(-1, -1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalCimaDireita: function (quantidade) {
			return this.fornecerAdjacentes(-1, 1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalBaixoEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(1, -1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalBaixoDireita: function (quantidade) {
			return this.fornecerAdjacentes(1, 1, quantidade, false);
		},
		
		fornecerAdjacentes: function (incrementoNaLinha, incrementoNaColuna, quantidade, incluirForaDoTabuleiro) {
			var adjacentes = [];
			var linhaAtual = this.linha;
			var colunaAtual = this.coluna;
			for (var contador = 0; contador < quantidade; contador++) {
				linhaAtual += incrementoNaLinha;
				colunaAtual += incrementoNaColuna;
				var adjacente = this.tabuleiro.fornecerCelula(linhaAtual, colunaAtual);
				if (adjacente.dentroDoTabuleiro() || incluirForaDoTabuleiro) {
					adjacentes.push(adjacente);
				}
			}
			return adjacentes;
		},
		
		foraDoTabuleiro: function () {
			return false;
		},
		
		dentroDoTabuleiro: function () {
			return true;
		}
	});
	
	CelulaForaDoTabuleiro = new Prototipo({
		Estende: Celula,
		
		inicializar: function (tabuleiro) {
			this.tabuleiro = tabuleiro;
		},
		
		foraDoTabuleiro: function () {
			return true;
		},
		
		dentroDoTabuleiro: function () {
			return false;
		}
	});
	
	Jogador = new Prototipo({
		inicializar: function (nome, identificador) {
			this.nome = nome;
			this.identificador = identificador;
		},
		
		igual: function (outro) {
			return (this.identificador === outro.identificador);
		}
	});
	
	global.Ligue4Modelo = Ligue4Modelo;
}(this));
