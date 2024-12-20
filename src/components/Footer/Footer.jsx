import React from "react";
import { FiMail, FiPhone, FiLinkedin, FiGithub } from "react-icons/fi";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.footerContent}>
                <div className={styles.brand}>
                    <h2>Boletools</h2>
                    <p>Validando boletos com precisão e segurança.</p>
                </div>
                <div className={styles.contacts}>
                    <h3>Contatos</h3>
                    <ul>
                        <li>
                            <FiMail className={styles.icon} />
                            <a href="mailto:matheusedivaldodev@gmail.com">matheusedivaldodev@gmail.com</a>
                        </li>
                        <li>
                            <FiPhone className={styles.icon} />
                            <a href="tel:+5511932250639">(11) 93225-0639</a>
                        </li>
                        <li>
                            <FiLinkedin className={styles.icon} />
                            <a href="https://www.linkedin.com/in/matheus-silva-8297a320a/" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <FiGithub className={styles.icon} />
                            <a href="https://github.com/matheusedivaldo" target="_blank">
                                GitHub
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.links}>
                    <h3>Links úteis</h3>
                    <ul>
                        <li><a href="#home">Início</a></li>
                        <li><a href="#features">Funcionalidades</a></li>
                        <li><a href="#privacidade">Política de Privacidade</a></li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; 2024 Boletools. Todos os direitos reservados.</p>
                <p>Desenvolvido por <a href="https://matheusedivaldo.com.br/" target="_blank" rel="noopener noreferrer">Matheus Edivaldo</a></p>
            </div>
        </footer>
    );
};

export default Footer;