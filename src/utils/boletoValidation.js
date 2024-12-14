/**
 * Identifica o tipo de código inserido (se baseando na quantidade de dígitos).
 *
 * ------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * ------------
 *
 * @return {string} CODIGO_DE_BARRAS
 * @return {string} LINHA_DIGITAVEL
 */
function identificarTipoCodigo(codigo) {
  if (typeof codigo !== "string")
    throw new TypeError("Insira uma string válida!");

  codigo = codigo.replace(/[^0-9]/g, "");

  if (codigo.length === 44) {
    return "CODIGO_DE_BARRAS";
  } else if (
    codigo.length === 46 ||
    codigo.length === 47 ||
    codigo.length === 48
  ) {
    return "LINHA_DIGITAVEL";
  } else {
    return "TAMANHO_INCORRETO";
  }
}

/**
 * Identifica o tipo de boleto inserido a partir da validação de seus dois dígitos iniciais.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {string} BANCO
 * @return {string} ARRECADACAO_PREFEITURA
 * @return {string} ARRECADACAO_ORGAOS_GOVERNAMENTAIS
 * @return {string} ARRECADACAO_TAXAS_DE_TRANSITO
 * @return {string} CONVENIO_SANEAMENTO
 * @return {string} CONVENIO_ENERGIA_ELETRICA_E_GAS
 * @return {string} CONVENIO_TELECOMUNICACOES
 * @return {string} OUTROS
 * @return {string} CARTAO_DE_CREDITO
 */
function identificarTipoBoleto(codigo) {
  codigo = codigo.replace(/[^0-9]/g, "");

  if (typeof codigo !== "string")
    throw new TypeError("Insira uma string válida!");

  if (
    codigo.slice(-14) === "00000000000000" ||
    codigo.slice(5, 19) === "00000000000000"
  ) {
    return "CARTAO_DE_CREDITO";
  } else if (codigo.slice(0, 1) === "8") {
    const segundoDigito = codigo.slice(1, 2);
    if (segundoDigito === "1") {
      return "ARRECADACAO_PREFEITURA";
    } else if (segundoDigito === "2") {
      return "CONVENIO_SANEAMENTO";
    } else if (segundoDigito === "3") {
      return "CONVENIO_ENERGIA_ELETRICA_E_GAS";
    } else if (segundoDigito === "4") {
      return "CONVENIO_TELECOMUNICACOES";
    } else if (segundoDigito === "5") {
      return "ARRECADACAO_ORGAOS_GOVERNAMENTAIS";
    } else if (segundoDigito === "6" || segundoDigito === "9") {
      return "OUTROS";
    } else if (segundoDigito === "7") {
      return "ARRECADACAO_TAXAS_DE_TRANSITO";
    }
  } else {
    return "BANCO";
  }
}

/**
 * Identifica o código de referência do boleto para determinar qual módulo
 * será utilizado para calcular os dígitos verificadores.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {json} {mod, efetivo}
 */
function identificarReferencia(codigo) {
  codigo = codigo.replace(/[^0-9]/g, "");

  if (typeof codigo !== "string")
    throw new TypeError("Insira uma string válida!");

  const referencia = codigo.slice(2, 3);

  switch (referencia) {
    case "6":
      return {
        mod: 10,
        efetivo: true,
      };
    case "7":
      return {
        mod: 10,
        efetivo: false,
      };
    case "8":
      return {
        mod: 11,
        efetivo: true,
      };
    case "9":
      return {
        mod: 11,
        efetivo: false,
      };
    default:
      return null;
  }
}

/**
 * Identifica o fator da data de vencimento do boleto.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {Date} dataBoleto
 */
function identificarData(codigo, tipoCodigo) {
  codigo = codigo.replace(/[^0-9]/g, "");

  const tipoBoleto = identificarTipoBoleto(codigo);
  let fatorData = "";
  let dataBoleto = new Date(Date.UTC(1997, 9, 7));

  if (tipoCodigo === "CODIGO_DE_BARRAS") {
    if (tipoBoleto === "BANCO" || tipoBoleto === "CARTAO_DE_CREDITO") {
      fatorData = codigo.slice(5, 9);
    } else {
      fatorData = "0";
    }
  } else if (tipoCodigo === "LINHA_DIGITAVEL") {
    if (tipoBoleto === "BANCO" || tipoBoleto === "CARTAO_DE_CREDITO") {
      fatorData = codigo.slice(33, 37);
    } else {
      fatorData = "0";
    }
  }

  const diasParaAdicionar = Number(fatorData);
  dataBoleto.setUTCDate(dataBoleto.getUTCDate() + diasParaAdicionar);

  const dia = String(dataBoleto.getUTCDate()).padStart(2, "0");
  const mes = String(dataBoleto.getUTCMonth() + 1).padStart(2, "0");
  const ano = dataBoleto.getUTCFullYear();

  return `${dia}/${mes}/${ano}`;
}

/**
 * Identifica o valor no CÓDIGO DE BARRAS do boleto do tipo 'Arrecadação'.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {string} valorFinal
 */
function identificarValorCodBarrasArrecadacao(codigo, tipoCodigo) {
  codigo = codigo.replace(/[^0-9]/g, "");

  const referencia = identificarReferencia(codigo);
  const isValorEfetivo = referencia ? referencia.efetivo : false;

  let valorBoleto = "";
  let valorFinal;

  if (isValorEfetivo) {
    if (tipoCodigo === "LINHA_DIGITAVEL") {
      valorBoleto = codigo.slice(4, 18);
      valorBoleto = codigo.split("");
      valorBoleto.splice(11, 1);
      valorBoleto = valorBoleto.join("");
      valorBoleto = valorBoleto.slice(4, 15);
    } else if (tipoCodigo === "CODIGO_DE_BARRAS") {
      valorBoleto = codigo.slice(4, 15);
    }

    valorFinal = valorBoleto.slice(0, 9) + "." + valorBoleto.slice(9, 11);

    let char = valorFinal.slice(0, 1);
    while (char === "0" && valorFinal.length > 1) {
      valorFinal = substringReplace(valorFinal, "", 0, 1);
      char = valorFinal.slice(0, 1);
    }
  } else {
    valorFinal = "0";
  }

  return valorFinal;
}

/**
 * Identifica o valor no boleto inserido.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {float} valorFinal
 */
function identificarValor(codigo, tipoCodigo) {
  const tipoBoleto = identificarTipoBoleto(codigo);

  let valorBoleto = "";
  let valorFinal;

  if (tipoCodigo === "CODIGO_DE_BARRAS") {
    if (tipoBoleto === "BANCO" || tipoBoleto === "CARTAO_DE_CREDITO") {
      valorBoleto = codigo.slice(9, 19);
      valorFinal = valorBoleto.slice(0, 8) + "." + valorBoleto.slice(8, 10);

      let char = valorFinal.slice(1, 2);
      while (char === "0") {
        valorFinal = substringReplace(valorFinal, "", 0, 1);
        char = valorFinal.slice(1, 2);
      }
    } else {
      valorFinal = identificarValorCodBarrasArrecadacao(
        codigo,
        "CODIGO_DE_BARRAS"
      );
    }
  } else if (tipoCodigo === "LINHA_DIGITAVEL") {
    if (tipoBoleto === "BANCO" || tipoBoleto === "CARTAO_DE_CREDITO") {
      valorBoleto = codigo.slice(37);
      valorFinal = valorBoleto.slice(0, 8) + "." + valorBoleto.slice(8, 10);

      let char = valorFinal.slice(1, 2);
      while (char === "0") {
        valorFinal = substringReplace(valorFinal, "", 0, 1);
        char = valorFinal.slice(1, 2);
      }
    } else {
      valorFinal = identificarValorCodBarrasArrecadacao(
        codigo,
        "LINHA_DIGITAVEL"
      );
    }
  }
  return parseFloat(valorFinal);
}

/**
 * Função auxiliar para remover os zeros à esquerda dos valores detectados no código inserido
 *
 * -------------
 *
 * @param {string} str Texto a ser verificado
 * @param {string} repl Texto que substituirá
 * @param {int} inicio Posição inicial
 * @param {int} tamanho Tamanho
 *
 * -------------
 *
 * @return {string} resultado
 */
function substringReplace(str, repl, inicio, tamanho) {
  if (inicio < 0) {
    inicio = inicio + str.length;
  }

  tamanho = tamanho !== undefined ? tamanho : str.length;
  if (tamanho < 0) {
    tamanho = tamanho + str.length - inicio;
  }

  return [
    str.slice(0, inicio),
    repl.substring(0, tamanho),
    repl.slice(tamanho),
    str.slice(inicio + tamanho),
  ].join("");
}

/**
 * Define qual módulo deverá ser utilizado para calcular os dígitos verificadores.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {int} mod Modulo 10 ou Modulo 11
 *
 * -------------
 *
 * @return {string} digitoVerificador
 */
function digitosVerificadores(codigo, mod) {
  codigo = codigo.replace(/[^0-9]/g, "");

  switch (mod) {
    case 10:
      return (codigo + calculaMod10(codigo)).toString();
    case 11:
      return (codigo + calculaMod11(codigo)).toString();
    default:
      throw new Error("Módulo inválido. Use 10 ou 11.");
  }
}

/**
 * Converte a numeração do código de barras em linha digitável
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {boolean} formatada Gerar numeração convertida com formatação (formatado = true / somente números = false)
 *
 * -------------
 *
 * @return {string} resultado
 */
function codBarras2LinhaDigitavel(codigo, formatada) {
  codigo = codigo.replace(/[^0-9]/g, "");

  const tipoBoleto = identificarTipoBoleto(codigo);

  let resultado = "";

  if (tipoBoleto == "BANCO" || tipoBoleto == "CARTAO_DE_CREDITO") {
    const novaLinha =
      codigo.slice(0, 4) +
      codigo.slice(19, 44) +
      codigo.slice(4, 5) +
      codigo.slice(5, 19);

    const bloco1 = novaLinha.slice(0, 9) + calculaMod10(novaLinha.slice(0, 9));
    const bloco2 =
      novaLinha.slice(9, 19) + calculaMod10(novaLinha.slice(9, 19));
    const bloco3 =
      novaLinha.slice(19, 29) + calculaMod10(novaLinha.slice(19, 29));
    const bloco4 = novaLinha.slice(29);

    resultado = (bloco1 + bloco2 + bloco3 + bloco4).toString();

    if (formatada) {
      resultado =
        resultado.slice(0, 5) +
        "." +
        resultado.slice(5, 10) +
        " " +
        resultado.slice(10, 15) +
        "." +
        resultado.slice(15, 21) +
        " " +
        resultado.slice(21, 26) +
        "." +
        resultado.slice(26, 32) +
        " " +
        resultado.slice(32, 33) +
        " " +
        resultado.slice(33);
    }
  } else {
    const identificacaoValorRealOuReferencia = identificarReferencia(codigo);
    let bloco1;
    let bloco2;
    let bloco3;
    let bloco4;

    if (identificacaoValorRealOuReferencia.mod == 10) {
      bloco1 = codigo.slice(0, 11) + calculaMod10(codigo.slice(0, 11));
      bloco2 = codigo.slice(11, 22) + calculaMod10(codigo.slice(11, 22));
      bloco3 = codigo.slice(22, 33) + calculaMod10(codigo.slice(22, 33));
      bloco4 = codigo.slice(33, 44) + calculaMod10(codigo.slice(33, 44));
    } else if (identificacaoValorRealOuReferencia.mod == 11) {
      bloco1 = codigo.slice(0, 11) + calculaMod11(codigo.slice(0, 11));
      bloco2 = codigo.slice(11, 22) + calculaMod11(codigo.slice(11, 22));
      bloco3 = codigo.slice(22, 33) + calculaMod11(codigo.slice(22, 33));
      bloco4 = codigo.slice(33, 44) + calculaMod11(codigo.slice(33, 44));
    }

    resultado = bloco1 + bloco2 + bloco3 + bloco4;
  }

  return resultado;
}

/**
 * Calcula o dígito verificador de uma numeração a partir do módulo 10
 *
 * -------------
 *
 * @param {string} numero Numeração
 *
 * -------------
 *
 * @return {string} soma
 */
function calculaMod10(numero) {
  numero = numero.replace(/\D/g, "");
  let mult = 2;
  let soma = 0;
  let s = "";

  for (let i = numero.length - 1; i >= 0; i--) {
    s = mult * parseInt(numero.charAt(i)) + s;
    if (--mult < 1) {
      mult = 2;
    }
  }
  for (let i = 0; i < s.length; i++) {
    soma += parseInt(s.charAt(i));
  }
  soma = soma % 10;
  return soma !== 0 ? 10 - soma : 0;
}

/**
 * Calcula o dígito verificador de uma numeração a partir do módulo 11
 *
 * -------------
 *
 * @param {string} x Numeração
 *
 * -------------
 *
 * @return {string} digito
 */
function calculaMod11(x) {
  const sequencia = [4, 3, 2, 9, 8, 7, 6, 5];
  let digit = 0;
  let j = 0;

  for (let i = 0; i < x.length; i++) {
    const mult = sequencia[j];
    j++;
    j %= sequencia.length;
    digit += mult * parseInt(x.charAt(i));
  }

  const DAC = digit % 11;

  if (DAC === 0 || DAC === 1) return 0;
  if (DAC === 10) return 1;

  return 11 - DAC;
}

/**
 * Converte a numeração da linha digitável em código de barras
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {string} resultado
 */
function linhaDigitavel2CodBarras(codigo) {
  codigo = codigo.replace(/[^0-9]/g, "");

  const tipoBoleto = identificarTipoBoleto(codigo);

  let resultado = "";

  if (tipoBoleto == "BANCO" || tipoBoleto == "CARTAO_DE_CREDITO") {
    resultado =
      codigo.slice(0, 4) +
      codigo.slice(32, 33) +
      codigo.slice(33, 47) +
      codigo.slice(4, 9) +
      codigo.slice(10, 20) +
      codigo.slice(21, 31);
  } else {
    codigo = codigo.split("");
    codigo.splice(11, 1);
    codigo.splice(22, 1);
    codigo.splice(33, 1);
    codigo.splice(44, 1);
    codigo = codigo.join("");

    resultado = codigo;
  }

  return resultado;
}

/**
 * Calcula o dígito verificador de toda a numeração do código de barras
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {int} posicaoCodigo Posição onde deve se encontrar o dígito verificador
 * @param {int} mod Módulo 10 ou Módulo 11
 *
 * -------------
 *
 * @return {string} numero
 */
function calculaDVCodBarras(codigo, posicaoCodigo, mod) {
  codigo = codigo.replace(/[^0-9]/g, "");

  codigo = codigo.split("");
  codigo.splice(posicaoCodigo, 1);
  codigo = codigo.join("");

  if (mod === 10) {
    return calculaMod10(codigo);
  } else if (mod === 11) {
    return calculaMod11(codigo);
  }
}
/**
 * Informa se o código de barras inserido é válido, calculando seu dígito verificador.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {boolean} true = boleto válido / false = boleto inválido
 */
function validarCodigoComDV(codigo, tipoCodigo) {
  codigo = codigo.replace(/[^0-9]/g, "");
  let tipoBoleto;

  let resultado;

  if (tipoCodigo === "LINHA_DIGITAVEL") {
    tipoBoleto = identificarTipoBoleto(codigo, "LINHA_DIGITAVEL");

    if (tipoBoleto == "BANCO" || tipoBoleto == "CARTAO_DE_CREDITO") {
      const bloco1 = codigo.slice(0, 9) + calculaMod10(codigo.slice(0, 9));
      const bloco2 = codigo.slice(10, 20) + calculaMod10(codigo.slice(10, 20));
      const bloco3 = codigo.slice(21, 31) + calculaMod10(codigo.slice(21, 31));
      const bloco4 = codigo.slice(32, 33);
      const bloco5 = codigo.slice(33);

      resultado = (bloco1 + bloco2 + bloco3 + bloco4 + bloco5).toString();
    } else {
      const identificacaoValorRealOuReferencia = identificarReferencia(codigo);
      let bloco1;
      let bloco2;
      let bloco3;
      let bloco4;

      if (identificacaoValorRealOuReferencia.mod == 10) {
        bloco1 = codigo.slice(0, 11) + calculaMod10(codigo.slice(0, 11));
        bloco2 = codigo.slice(12, 23) + calculaMod10(codigo.slice(12, 23));
        bloco3 = codigo.slice(24, 35) + calculaMod10(codigo.slice(24, 35));
        bloco4 = codigo.slice(36, 47) + calculaMod10(codigo.slice(36, 47));
      } else if (identificacaoValorRealOuReferencia.mod == 11) {
        bloco1 = codigo.slice(0, 11);
        bloco2 = codigo.slice(12, 23);
        bloco3 = codigo.slice(24, 35);
        bloco4 = codigo.slice(36, 47);

        let dv1 = parseInt(codigo.slice(11, 12));
        let dv2 = parseInt(codigo.slice(23, 24));
        let dv3 = parseInt(codigo.slice(35, 36));
        let dv4 = parseInt(codigo.slice(47, 48));

        let valid =
          calculaMod11(bloco1) == dv1 &&
          calculaMod11(bloco2) == dv2 &&
          calculaMod11(bloco3) == dv3 &&
          calculaMod11(bloco4) == dv4;

        return valid;
      }

      resultado = bloco1 + bloco2 + bloco3 + bloco4;
    }
  } else if (tipoCodigo === "CODIGO_DE_BARRAS") {
    tipoBoleto = identificarTipoBoleto(codigo);

    if (tipoBoleto == "BANCO" || tipoBoleto == "CARTAO_DE_CREDITO") {
      const DV = calculaDVCodBarras(codigo, 4, 11);
      resultado = codigo.slice(0, 4) + DV + codigo.slice(5);
    } else {
      const identificacaoValorRealOuReferencia = identificarReferencia(codigo);

      resultado = codigo.split("");
      resultado.splice(3, 1);
      resultado = resultado.join("");

      const DV = calculaDVCodBarras(
        codigo,
        3,
        identificacaoValorRealOuReferencia.mod
      );
      resultado = resultado.slice(0, 3) + DV + resultado.slice(3);
    }
  }

  return codigo === resultado;
}

export {
  identificarTipoCodigo,
  identificarTipoBoleto,
  identificarReferencia,
  identificarData,
  identificarValorCodBarrasArrecadacao,
  identificarValor,
  linhaDigitavel2CodBarras,
  codBarras2LinhaDigitavel,
  calculaMod10,
  calculaMod11,
  calculaDVCodBarras,
  validarCodigoComDV,
  digitosVerificadores,
  substringReplace,
};
