import React, { useState, useRef, useEffect } from "react";
import styles from "./Hero.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    identificarTipoCodigo,
    identificarTipoBoleto,
    identificarData,
    linhaDigitavel2CodBarras,
    codBarras2LinhaDigitavel,
    validarCodigoComDV,
    identificarValor,
} from "../../utils/boletoValidation";

const formatarData = (dataString) => {
    const meses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
    ];
    const diasSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
    ];

    const [dia, mes, ano] = dataString.split("/");
    const data = new Date(`${ano}-${mes}-${dia}`);

    const diaSemana = diasSemana[data.getUTCDay()];
    const mesNome = meses[data.getUTCMonth()];
    const diaNumerico = data.getUTCDate().toString().padStart(2, "0");

    return `${diaSemana} • ${diaNumerico} de ${mesNome} de ${data.getUTCFullYear()}`;
};

const formatarTipoCodigo = (tipoCodigo) => {
    const formatos = {
        LINHA_DIGITAVEL: "Linha Digitável",
        CODIGO_DE_BARRAS: "Código de Barras",
        CARTAO_DE_CREDITO: "Cartão de Crédito",
        ARRECADACAO_PREFEITURA: "Arrecadação da Prefeitura",
        CONVENIO_SANEAMENTO: "Convênio de Saneamento",
        CONVENIO_ENERGIA_ELETRICA_E_GAS: "Convênio de Energia Elétrica e Gás",
        CONVENIO_TELECOMUNICACOES: "Convênio de Telecomunicações",
        ARRECADACAO_ORGAOS_GOVERNAMENTAIS: "Arrecadação de Órgãos Governamentais",
        ARRECADACAO_TAXAS_DE_TRANSITO: "Arrecadação de Taxas de Trânsito",
        OUTROS: "Outros",
        BANCO: "Banco",
    };

    return formatos[tipoCodigo] || "Não informado";
};

const Hero = () => {
    const [inputValue, setInputValue] = useState("");
    const [validationData, setValidationData] = useState({
        codigoDeBarras: "",
        linhaDigitavel: "",
        valido: false,
        tipoBoleto: "",
        tipoCodigo: "",
        valor: "",
        validade: "",
    });
    const maxLength = 56;
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value.length <= maxLength) {
            setInputValue(value);
        }
    };

    const handleValidate = () => {
        try {
            const sanitizedInput = inputValue.replace(/[^0-9]/g, "");

            if (!sanitizedInput) {
                toast.error("O campo está vazio ou contém caracteres inválidos!");
                setInputValue("");
                return;
            }

            const tipoCodigo = identificarTipoCodigo(sanitizedInput);
            const tipoBoleto = identificarTipoBoleto(sanitizedInput);
            const validade = identificarData(sanitizedInput, tipoCodigo);
            const valor = identificarValor(sanitizedInput, tipoCodigo);
            const valido = validarCodigoComDV(sanitizedInput, tipoCodigo);

            const codigoDeBarras =
                tipoCodigo === "LINHA_DIGITAVEL"
                    ? linhaDigitavel2CodBarras(sanitizedInput)
                    : sanitizedInput;

            const linhaDigitavel =
                tipoCodigo === "CODIGO_DE_BARRAS"
                    ? codBarras2LinhaDigitavel(sanitizedInput, true)
                    : sanitizedInput;

            if (valido) {
                toast.success("Boleto validado com sucesso!");
            } else {
                toast.warn("Boleto inválido! Verifique as informações e tente novamente.");
            }

            setValidationData({
                codigoDeBarras,
                linhaDigitavel,
                valido,
                tipoBoleto:
                    tipoBoleto.charAt(0).toUpperCase() + tipoBoleto.slice(1).toLowerCase(),
                tipoCodigo: formatarTipoCodigo(tipoCodigo),
                valor: valor ? `R$ ${valor.toFixed(2).replace(".", ",")}` : "Não informado",
                validade: validade ? formatarData(validade) : "Não informado",
            });
        } catch (error) {
            toast.error("Erro ao processar a validação do boleto!");
            setValidationData({
                codigoDeBarras: "",
                linhaDigitavel: "",
                valido: false,
                tipoBoleto: "Erro na validação",
                tipoCodigo: "Erro",
                valor: "Erro",
                validade: "Erro",
            });
        }
    };

    const handleClear = () => {
        setInputValue("");
        setValidationData({
            codigoDeBarras: "",
            linhaDigitavel: "",
            valido: false,
            tipoBoleto: "",
            tipoCodigo: "",
            valor: "",
            validade: "",
        });
        toast.info("Campos limpos com sucesso!");
    };

    return (
        <div className={styles.heroContainer} id="home">
            <ToastContainer />
            <h1 className={styles.heroTitle}>Praticidade em boletos</h1>
            <p className={styles.heroDescription}>
                Utilize <strong>nossa ferramenta</strong> para validar boletos com precisão, seja a partir do código de barras ou da linha digitável.
                Também realizamos <strong>conversões rápidas</strong> entre os dois formatos, tornando o processo mais eficiente e seguro.
            </p>
            <form className={styles.heroForm} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.heroInputContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        id="input"
                        value={inputValue}
                        onChange={handleChange}
                        className={`${styles.heroInput} ${validationData.valido === false ? styles.invalidInput : ""
                            }`}
                        placeholder=" "
                        maxLength={maxLength}
                        inputMode="numeric"
                        aria-label="Código de barras ou linha digitável"
                    />
                    <label htmlFor="input" className={styles.heroInputLabel}>
                        Código de Barras ou Linha Digitável
                    </label>
                </div>

                <div className={styles.formFooter}>
                    <span className={styles.characterCount}>
                        {inputValue.length}/{maxLength} caracteres
                    </span>
                    <div className={styles.buttonsContainer}>
                        <button type="button" onClick={handleClear} className={styles.clearButton}>
                            Limpar
                        </button>
                        <button
                            type="button"
                            onClick={handleValidate}
                            className={styles.submitButton}
                        >
                            Validar
                        </button>
                    </div>
                </div>
            </form>
            <div className={styles.validationResult}>
                <h2>Detalhes da Validação</h2>
                <ul>
                    <li>
                        <strong>Código de Barras Gerado:</strong>{" "}
                        {validationData.valido ? validationData.codigoDeBarras : "—"}
                    </li>
                    <li>
                        <strong>Linha Digitável Gerada:</strong>{" "}
                        {validationData.valido ? validationData.linhaDigitavel : "—"}
                    </li>
                    <li>
                        <strong>Status de Validação:</strong>{" "}
                        {validationData.valido ? "Boleto Válido" : "Boleto Inválido"}
                    </li>
                    <li>
                        <strong>Categoria do Boleto:</strong>{" "}
                        {validationData.valido ? validationData.tipoBoleto : "—"}
                    </li>
                    <li>
                        <strong>Formato Inserido:</strong>{" "}
                        {validationData.valido ? validationData.tipoCodigo : "—"}
                    </li>
                    <li>
                        <strong>Valor do Boleto:</strong>{" "}
                        {validationData.valido ? validationData.valor : "—"}
                    </li>
                    <li>
                        <strong>Data de Validade:</strong>{" "}
                        {validationData.valido ? validationData.validade : "—"}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Hero;