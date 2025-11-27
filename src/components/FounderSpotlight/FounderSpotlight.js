'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './FounderSpotlight.module.css';

export default function FounderSpotlight() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- CABEÇALHO (AGORA GIGANTE E ESPAÇADO) --- */}
        <div className={styles.header}>
          <div className="teen-stack" style={{ transform: 'none' }}>
            
            {/* LINHA 1 */}
            <span className="teen-top" style={{ 
              fontSize: 'clamp(4rem, 8vw, 6.5rem)', 
              lineHeight: '1',
              marginBottom: '10px' 
            }}>
              QUEM FAZ
            </span>
            
            {/* LINHA 2 (Script com respiro) */}
            <span className="teen-middle" style={{ 
              fontSize: 'clamp(5rem, 10vw, 8rem)', 
              color: 'var(--neon-yellow)', 
              transform: 'none',
              margin: '15px 0', /* Espaçamento vertical */
              lineHeight: '1'
            }}>
              a mágica
            </span>
            
            {/* LINHA 3 */}
            <span className="teen-bottom" style={{ 
              fontSize: 'clamp(4.5rem, 9vw, 7rem)', 
              lineHeight: '1',
              marginTop: '10px'
            }}>
              ACONTECER
            </span>
          </div>
        </div>

        <div className={styles.contentGrid}>
          
          {/* --- FOTO 1 (PRINCIPAL) --- */}
          <motion.div 
            className={styles.cardLarge}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src="/fundador/teste.png" alt="Lorena Lima" className={styles.image} />
            
            {/* OVERLAY: OS JEANS MAIS COOL (Mantido igual vc gostou) */}
            <div className={styles.overlayTextMain}>
              <div className="teen-stack" style={{ alignItems: 'flex-start', transform: 'none', textAlign: 'left' }}>
                <span className="teen-top" style={{ color: '#fff', textShadow: '4px 4px 0 #000', fontSize: '3.5rem' }}>
                  OS JEANS
                </span>
                <span className="teen-middle" style={{ 
                  color: 'var(--brand-pink)', 
                  marginLeft: '60px', 
                  marginTop: '0px', 
                  marginBottom: '0px',
                  transform: 'none', 
                  textShadow: '2px 2px 0 #fff' 
                }}>
                  mais
                </span>
                <span className="teen-bottom" style={{ 
                  color: 'transparent', 
                  WebkitTextStroke: '2px #fff', 
                  fontSize: '5rem',
                  marginLeft: '60px',
                  lineHeight: '0.9'
                }}>
                  COOL
                </span>
              </div>
            </div>
            
            <div className={styles.tape}></div>
          </motion.div>

          {/* --- COLUNA DIREITA --- */}
          <div className={styles.rightCol}>
            
            <div className={styles.textBox}>
              <h3 className={styles.nameTitle}>LORENA LIMA</h3>
              <p>
                "Não é só sobre roupa usada. É sobre <strong>energia</strong>, curadoria e dar um novo ciclo para peças incríveis."
              </p>
              <Link href="/founder" className={styles.linkBtn}>
                CONHEÇA A HISTÓRIA ➜
              </Link>
            </div>

            <motion.div 
              className={styles.cardSmall}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img src="/fundador/1.jpeg" alt="Curadoria" className={styles.image} />
              
              <div className={styles.overlayCenter}>
                <div className="teen-stack" style={{ transform: 'none' }}>
                  <span className="teen-top" style={{ fontSize: '2rem' }}>SUAS PEÇAS</span>
                  <span className="teen-middle" style={{ fontSize: '2.5rem', color: '#fff', transform: 'none' }}>fazendo</span>
                  <span className="teen-bottom" style={{ fontSize: '2.5rem', color: '#fff' }}>NOVAS</span>
                </div>
              </div>
              
              <div className={styles.sticker}>★ CHECK</div>
            </motion.div>

          </div>

        </div>

        <div className={styles.marqueeStrip}>
          <span>CURADORIA</span> • <span>LIFESTYLE</span> • <span>PROPÓSITO</span> • <span>CURADORIA</span> • <span>LIFESTYLE</span>
        </div>

      </div>
    </section>
  );
}