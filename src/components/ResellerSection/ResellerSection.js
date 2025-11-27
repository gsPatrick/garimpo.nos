'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ResellerSection.module.css';

export default function ResellerSection() {
  return (
    <section className={styles.section}>
      
      {/* Background Grid Sutil (Reto) */}
      <div className={styles.bgGrid}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* --- COLUNA ESQUERDA: FOTO DA LORENA (COM DETALHES) --- */}
          <motion.div 
            className={styles.visualCol}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.photoFrame}>
              {/* Fita Adesiva Reta no topo */}
              <div className={styles.tapeTop}></div>
              
              <img 
                src="/fundador/teste.png" 
                alt="Lorena Lima - Junte-se a nós" 
                className={styles.lorenaImage} 
              />
              
              {/* Badge Flutuante (Reto) */}
              <div className={styles.vipBadge}>
                <span>MEMBER</span>
                <strong>VIP ACCESS</strong>
              </div>

              {/* Legenda inferior */}
              <div className={styles.photoFooter}>
                <span>LORENA LIMA</span>
                <span>★ FOUNDER</span>
              </div>
            </div>
          </motion.div>


          {/* --- COLUNA DIREITA: TEXTO & BENEFÍCIOS --- */}
          <motion.div 
            className={styles.textCol}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            
            <div className={styles.labelTop}>OPORTUNIDADE</div>

            {/* FRASE GIGANTE ALINHADA */}
            <div className="teen-stack" style={{ 
              alignItems: 'flex-start', 
              textAlign: 'left', 
              width: '100%',
              transform: 'none',
              marginBottom: '30px'
            }}>
              
              <span className="teen-top" style={{ 
                fontSize: 'clamp(4rem, 8vw, 6rem)', 
                color: 'var(--text-main)', 
                lineHeight: '0.9',
                textShadow: 'none'
              }}>
                JUNTE-SE
              </span>
              
              <span className="teen-middle" style={{ 
                fontSize: 'clamp(5rem, 9vw, 8rem)', 
                color: 'var(--brand-pink)', 
                transform: 'none', 
                margin: '5px 0',
                textShadow: 'none' 
              }}>
                à nós
              </span>
              
              <span className="teen-bottom" style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                color: 'var(--text-main)',
                lineHeight: '1',
                letterSpacing: '1px'
              }}>
                COMO REVENDEDORA
              </span>

            </div>

            <p className={styles.description}>
              Transforme sua paixão por moda em negócio. 
              Aqui você tem suporte, curadoria e lucro real.
            </p>

            {/* --- DETALHES EXTRAS: GRID DE BENEFÍCIOS --- */}
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <span className={styles.icon}>$$$</span>
                <span className={styles.benefitText}>LUCRO REAL</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.icon}>♥</span>
                <span className={styles.benefitText}>COMUNIDADE</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.icon}>✦</span>
                <span className={styles.benefitText}>SUPORTE VIP</span>
              </div>
            </div>
            
            <div className={styles.actionArea}>
              <Link href="/reseller" className={styles.ctaBtn}>
                QUERO FAZER PARTE ➜
              </Link>
              <span className={styles.obs}>*Vagas limitadas por região</span>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}