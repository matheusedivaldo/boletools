import React from "react";
import styles from "./Features.module.css";

const features = [
    {
        title: "Validação precisa",
        description: "Verifique rapidamente a validade de boletos bancários com tecnologia avançada.",
        icon: "✔️",
    },
    {
        title: "Conversão entre formatos",
        description: "Converta entre código de barras e linha digitável de forma instantânea.",
        icon: "🔄",
    },
    {
        title: "Interface intuitiva",
        description: "Utilize uma interface amigável e acessível para agilizar seus processos.",
        icon: "✨",
    },
];

const Features = () => {
    return (
        <section className={styles.featuresContainer} id="features">
            <h2 className={styles.featuresTitle}>Funcionalidades</h2>
            <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.featureCard}>
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