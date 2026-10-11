class FormatarTexto {
    removerEspacosDuplicados(texto) {
        return texto.trim().replace(/\s+/g, " ");
    }
    maiusculo(texto) {
        return texto.trim().toUpperCase();
    }
    minusculo(texto) {
        return texto.trim().toLowerCase();
    }
    capitalizarPalavras(nome) {
        return this.removerEspacosDuplicados(nome).split(" ").map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(" ");
    }

}
module.exports = new FormatarTexto();