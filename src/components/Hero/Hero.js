'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Hero.module.css';

// Componente para letras recortadas (Mantido igual)
const CutoutLetter = ({ letter, color, rotate, delay }) => (
  <motion.span
    className={`${styles.cutoutLetter} ${color === 'pink' ? styles.pinkBg : styles.blackBg}`}
    style={{ rotate: rotate }}
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: delay, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1, rotate: 0 }}
  >
    {letter}
  </motion.span>
);

export default function Hero() {
  return (
    <section className={styles.heroSection}>

      <div className={styles.bgGrid}></div>
      <div className={styles.blobPink}></div>

      <div className={styles.container}>

        {/* --- LADO ESQUERDO (TEXTOS) --- */}
        <div className={styles.textSide}>

          {/* Badge Alterado */}
          <motion.div
            className={styles.topBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            ★ JUNTE-SE A NÓS
          </motion.div>

          {/* TÍTULO (Mantido o efeito Ransom Note) */}
          <div className={styles.titleWrapper}>
            <div className={styles.rowTop}>
              <CutoutLetter letter="G" color="black" rotate="-5deg" delay={0.1} />
              <CutoutLetter letter="A" color="pink" rotate="3deg" delay={0.15} />
              <CutoutLetter letter="R" color="black" rotate="-2deg" delay={0.2} />
              <CutoutLetter letter="I" color="black" rotate="4deg" delay={0.25} />
              <CutoutLetter letter="M" color="pink" rotate="-3deg" delay={0.3} />
              <CutoutLetter letter="P" color="black" rotate="2deg" delay={0.35} />
              <CutoutLetter letter="O" color="black" rotate="-4deg" delay={0.4} />
            </div>

            <div className={styles.rowBottom}>
              <motion.span
                className={styles.outlineText}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                .NÓS
              </motion.span>
            </div>
          </div>

          <div className={styles.scriptContainer}>
            <span className={styles.arrowDoodle}>⤷</span>
            <h2 className={styles.scriptSubtitle}>
              Moda Circular <br /> com <span className={styles.highlight}>Propósito!</span>
            </h2>
          </div>

          <p className={styles.description}>
            O ponto de encontro entre o <strong>Outlet</strong>, o <strong>Second Hand</strong> e o seu estilo único.
          </p>

          <div className={styles.ctaWrapper}>
            {/* Botão Alterado */}
            <Link href="/shop" className={styles.btnPrimary}>
              VER OUTLET
            </Link>

            {/* Tag Price Removed */}
          </div>
        </div>

        {/* --- LADO DIREITO (AS 3 POLAROIDS JUNTAS) --- */}
        <div className={styles.visualSide}>

          {/* FOTO 1 (Fundo) */}
          <motion.div
            className={`${styles.polaroid} ${styles.p1}`}
            animate={{ y: [0, -8, 0], rotate: [-15, -12, -15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/hero/1.jpeg" alt="Look 1" />
            <span className={styles.tape}></span>
            <span className={styles.stickerWord}>COOL</span>
          </motion.div>

          {/* FOTO 2 (Meio) */}
          <motion.div
            className={`${styles.polaroid} ${styles.p2}`}
            animate={{ y: [0, 10, 0], rotate: [10, 8, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <img src="/hero/5.jpeg" alt="Look 2" />
            <span className={styles.tape}></span>
            <span className={styles.stickerWordPink}>VIBE</span>
          </motion.div>

          {/* FOTO 3 (Frente - Destaque) */}
          <motion.div
            className={`${styles.polaroid} ${styles.p3}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: -2 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <img src="/hero/3.jpeg" alt="Acessórios" />
            <span className={styles.tape}></span>
          </motion.div>

          {/* Elementos Soltos */}
          <div className={styles.star1}>✦</div>
          <div className={styles.star2}>★</div>

          {/* Sticker NEW DROP (Rosa e Cinza) */}
          <motion.div
            className={styles.circleSticker}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100">
              <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
              <text>
                <textPath href="#curve" fill="#fff" fontWeight="bold">
                  • NEW DROP • NEW DROP • NEW DROP •
                </textPath>
              </text>
            </svg>
          </motion.div>

        </div>

      </div>

      <div className={styles.rippedPaper}></div>
    </section>
  );
}