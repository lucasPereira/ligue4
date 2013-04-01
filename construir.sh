#!/bin/bash

projeto=Ligue4
pacoteDoProjeto=ligue4

bibliotecas=bibliotecas
binarios=binarios
construcao=construcao
documentacao=documentacao
fontes=fontes
recursos=recursos
testes=testes

bibliotecasCss=${bibliotecas}/css
bibliotecasJs=${bibliotecas}/js
binariosCss=${binarios}/css
binariosHtml=${binarios}/html
binariosJs=${binarios}/js
fontesHtml=${fontes}/html
fontesJs=${fontes}/js

limpar() {
	echo ":limpar";
	rm -rf ${binarios};
	rm -rf ${construcao};
}

criarEstrutura() {
	echo ":criarEstrutura";
	mkdir -p ${bibliotecasCss};
	mkdir -p ${bibliotecasJs};
	mkdir -p ${binariosCss};
	mkdir -p ${binariosHtml};
	mkdir -p ${binariosJs};
	mkdir -p ${construcao};
	mkdir -p ${fontesHtml};
	mkdir -p ${fontesJs};
}

adicionarBibliotecas() {
	echo ":adicionarBibliotecas";
	cp -rf ~/projetos/estilos/construcao/limpo.css -t ${bibliotecasCss};
	cp -rf ~/projetos/lindaJs/construcao/linda.js -t ${bibliotecasJs};
}

compilar() {
	limpar;
	criarEstrutura;
	adicionarBibliotecas;
	echo ":compilar";
	cp -rf ${bibliotecasCss}/* ${binariosCss};
	cp -rf ${fontesHtml}/* ${binariosHtml};
	cp -rf ${bibliotecasJs}/* ${fontesJs}/* ${binariosJs};
}

construir() {
	compilar;
	echo ":construir";
}

testar() {
	construir;
	echo ":testar";
}

depurar() {
	construir;
	echo ":depurar";
	google-chrome ${fontesHtml}/${pacoteDoProjeto}.html;
}

executar() {
	construir;
	echo ":executar";
	google-chrome ${binariosHtml}/${pacoteDoProjeto}.html;
}

echo :${pacoteDoProjeto}
if [ -n "$1" ]
then
	$1;
else
	construir;
fi
