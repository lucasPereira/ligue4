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
					Ligue4.instancia.declararVencedor(this.tabuleiro.fornecerSequenciasVencedoras());
				} else if (this.tabuleiro.fimDeCelulas()) {
					Ligue4.instancia.declararEmpate();
				}
				this.ordemDeJogadores.push(this.ordemDeJogadores.shift());
			} else {
				Ligue4.instancia.declararColunaCheia();
			}
			return jogadaRealizada;
		},
		
		humanoPodeJogar: function () {
			return (this.ordemDeJogadores.primeiro().igual(this.jogadores.humano) && this.podeJogar());
		},
		
		computadorPodeJogar: function () {
			return (this.ordemDeJogadores.primeiro().igual(this.jogadores.computador) && this.podeJogar());
		},
		
		podeJogar: function () {
			return !(this.tabuleiro.possuiSequenciaVencedora() || this.tabuleiro.fimDeCelulas());
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
				celulaAtual = celulaAtual.fornecerAdjacenteTopo();
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
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteTopo().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteFundo().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteEsquerda().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteDireita().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteTopoEsquerda().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteTopoDireita().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteFundoEsquerda().verificarSequenciasVencedoras());
			this.sequenciasVencedoras.fundir(ultimaCelulaOcupada.fornecerAdjacenteFundoDireita().verificarSequenciasVencedoras());
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
			sequenciasDeVitoria.push(this.fornecerAdjacentesVerticalTopo(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesVerticalFundo(quantidadeDeLigacoes))
			sequenciasDeVitoria.push(this.fornecerAdjacentesHorizontalEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesHorizontalDireita(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalTopoEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalTopoDireita(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalFundoEsquerda(quantidadeDeLigacoes));
			sequenciasDeVitoria.push(this.fornecerAdjacentesDiagonalFundoDireita(quantidadeDeLigacoes));
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
		
		fornecerAdjacenteTopo: function () {
			return this.fornecerAdjacentes(-1, 0 ,1, true).primeiro();
		},
		
		fornecerAdjacenteFundo: function () {
			return this.fornecerAdjacentes(1, 0 ,1, true).primeiro();
		},
		
		fornecerAdjacenteEsquerda: function () {
			return this.fornecerAdjacentes(0, -1 ,1, true).primeiro();
		},
		
		fornecerAdjacenteDireita: function () {
			return this.fornecerAdjacentes(0, 1 ,1, true).primeiro();
		},

		fornecerAdjacenteTopoEsquerda: function () {
			return this.fornecerAdjacentes(-1, -1 ,1, true).primeiro();
		},
		
		fornecerAdjacenteTopoDireita: function () {
			return this.fornecerAdjacentes(-1, 1 ,1, true).primeiro();
		},
		
		fornecerAdjacenteFundoEsquerda: function () {
			return this.fornecerAdjacentes(1, -1 ,1, true).primeiro();
		},
		
		fornecerAdjacenteFundoDireita: function () {
			return this.fornecerAdjacentes(1, 1 ,1, true).primeiro();
		},
		
		fornecerAdjacentesVerticalTopo: function (quantidade) {
			return this.fornecerAdjacentes(-1, 0, quantidade, false);
		},
		
		fornecerAdjacentesVerticalFundo: function (quantidade) {
			return this.fornecerAdjacentes(1, 0, quantidade, false);
		},
		
		fornecerAdjacentesHorizontalEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(0, -1, quantidade, false);
		},
		
		fornecerAdjacentesHorizontalDireita: function (quantidade) {
			return this.fornecerAdjacentes(0, 1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalTopoEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(-1, -1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalTopoDireita: function (quantidade) {
			return this.fornecerAdjacentes(-1, 1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalFundoEsquerda: function (quantidade) {
			return this.fornecerAdjacentes(1, -1, quantidade, false);
		},
		
		fornecerAdjacentesDiagonalFundoDireita: function (quantidade) {
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
