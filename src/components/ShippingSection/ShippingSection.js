'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ShippingSection.module.css';

export default function ShippingSection() {
  return (
    <section className={styles.section}>
      
      {/* Fundo com linhas de caderno (Agora cinza/adaptável ao tema) */}
      <div className={styles.paperBg}></div>

      <div className={styles.container}>
        
        <div className={styles.grid}>
          
          {/* --- COLUNA ESQUERDA: A MENSAGEM --- */}
          <motion.div 
            className={styles.textCol}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* CABEÇALHO PEQUENO */}
            <div className={styles.topBadge}>
              <span>★ ENVIO IMEDIATO PARA TODO O BRASIL</span>
            </div>

            {/* A FRASE NO PADRÃO (RETA - BLOCO VERTICAL) */}
            <div className="teen-stack" style={{ 
              alignItems: 'flex-start', /* Alinha tudo à esquerda */
              transform: 'none', 
              textAlign: 'left', 
              marginBottom: '40px',
              width: '100%' 
            }}>
              
              {/* 1. SÓLIDO */}
              <span className="teen-top" style={{ 
                fontSize: 'clamp(4rem, 8vw, 6rem)', 
                color: 'var(--text-main)', /* Adapta ao tema */
                lineHeight: '0.8',
                textShadow: '4px 4px 0 var(--brand-pink)' 
              }}>
                FRETE
              </span>
              
              {/* 2. SCRIPT (ROSA) */}
              <span className="teen-middle" style={{ 
                fontSize: 'clamp(5rem, 9vw, 8rem)', 
                color: 'var(--brand-pink)', /* Rosa da Marca */
                transform: 'none', 
                margin: '5px 0', /* Apenas respiro vertical */
                textShadow: '3px 3px 0 var(--bg-main)' /* Sombra na cor do fundo */
              }}>
                grátis
              </span>
              
              {/* 3. SÓLIDO/OUTLINE */}
              <span className="teen-bottom" style={{ 
                fontSize: 'clamp(5rem, 10vw, 9rem)', 
                color: 'transparent',
                WebkitTextStroke: '3px var(--text-main)', /* Borda adapta ao tema */
                lineHeight: '0.8',
                marginLeft: '0' /* SEM ESCADA */
              }}>
                SEMPRE
              </span>

            </div>

            {/* TEXTO EXPLICATIVO */}
            <div className={styles.infoBox}>
              <p>
                Esquece a calculadora. Aqui <strong>não tem valor mínimo</strong> e nem pegadinha. 
                Escolheu seu look? O envio é por nossa conta.
              </p>
              
              <Link href="/shop" className={styles.ctaBtn}>
                GARANTIR MEU LOOK ➜
              </Link>
            </div>

          </motion.div>


          {/* --- COLUNA DIREITA: FOTO/COLAGEM --- */}
          <motion.div 
            className={styles.visualCol}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            
            <div className={styles.imageStack}>
              {/* Foto Principal */}
              <div className={styles.mainPhotoWrapper}>
                <div className={styles.tape}></div>
                <img src="/hero/5.jpeg" alt="Entrega Garimpo" className={styles.mainImage} />
                
                {/* Sticker de Aviso (Rosa e Preto) */}
                <div className={styles.stickerWarn}>
                  0% DE FRETE
                </div>
              </div>

              {/* Elemento Decorativo (Selo) */}
              <motion.div 
                className={styles.stamp}
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <div className={styles.fallbackStamp}>BR</div>
              </motion.div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}