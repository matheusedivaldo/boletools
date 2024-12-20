import React, { useEffect } from "react";
import { FaCheckCircle, FaExchangeAlt, FaMagic } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";
import styles from "./Features.module.css";

const features = [
    {
        title: "Validação precisa",
        description: "Verifique rapidamente a validade de boletos bancários com tecnologia avançada.",
        icon: <FaCheckCircle />,
    },
    {
        title: "Conversão entre formatos",
        description: "Converta entre código de barras e linha digitável de forma instantânea.",
        icon: <FaExchangeAlt />,
    },
    {
        title: "Interface intuitiva",
        description: "Utilize uma interface amigável e acessível para agilizar seus processos.",
        icon: <FaMagic />,
    },
];

const Features = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
        });
        AOS.refresh();
    }, []);

    return (
        <section className={styles.featuresContainer} id="features">
            <h2 className={styles.featuresTitle} data-aos="fade-up">
                Funcionalidades
            </h2>
            <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={styles.featureCard}
                        data-aos="zoom-in"
                        data-aos-delay={index * 100}
                    >
                        <div className={styles.featureIcon}>{feature.icon}</div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;