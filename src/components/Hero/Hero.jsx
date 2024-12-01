import React, { useState, useRef, useEffect } from "react";
import styles from "./Hero.module.css";

const validateInput = (input) => {
    const isValid = input.length === 47 || input.length === 48;
    return {
        codigoDeBarras: input,
        linhaDigitavel: input,
        valido: isValid,
        tipoBoleto: isValid ? "Boleto Bancário" : "Inválido",
        tipoCodigo: isValid ? "Código de Barras" : "Inválido",
        validade: isValid ? "12/12/2024" : "Inválido",
    };
};

const Hero = () => {
    const [inputValue, setInputValue] = useState("");
    const [validationData, setValidationData] = useState({
        codigoDeBarras: "",
        linhaDigitavel: "",
        valido: false,
        tipoBoleto: "",
        tipoCodigo: "",
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
        const result = validateInput(inputValue);
        setValidationData(result);
    };

    const handleClear = () => {
        setInputValue("");
        setValidationData({
            codigoDeBarras: "",
            linhaDigitavel: "",
            valido: false,
            tipoBoleto: "",
            tipoCodigo: "",
            validade: "",
        });
    };

    return (
        <div className={styles.heroContainer} id="home">
            <h1 className={styles.heroTitle}>Boletools</h1>
            <p className={styles.heroDescription}>
                Utilize nossa ferramenta para validar boletos com precisão, seja a partir do código de barras ou da linha digitável. Também realizamos conversões rápidas entre os dois formatos, tornando o processo mais eficiente e seguro.
            </p>
            <form className={styles.heroForm} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.heroInputContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        id="input"
                        value={inputValue}
                        onChange={handleChange}
                        className={`${styles.heroInput} ${validationData.valido === false ? styles.invalidInput : ''}`}
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
                        <button type="button" onClick={handleValidate} className={styles.submitButton}>
                            Validar
                        </button>
                    </div>
                </div>
            </form>

            <div className={styles.validationResult}>
                <h2>Resultado</h2>
                <ul>
                    <li><strong>Código de Barras:</strong> {validationData.codigoDeBarras || "Não informado"}</li>
                    <li><strong>Linha Digitável:</strong> {validationData.linhaDigitavel || "Não informado"}</li>
                    <li><strong>Válido:</strong> {validationData.valido ? "Sim" : "Não"}</li>
                    <li><strong>Tipo de Boleto:</strong> {validationData.tipoBoleto || "Não informado"}</li>
                    <li><strong>Tipo do Código Inserido:</strong> {validationData.tipoCodigo || "Não informado"}</li>
                    <li><strong>Validade:</strong> {validationData.validade || "Não informado"}</li>
                </ul>
            </div>
        </div>
    );
};

export default Hero;