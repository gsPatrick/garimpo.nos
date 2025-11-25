'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MarketingPopup.module.css';

export default function MarketingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Verifica se já viu o popup hoje
    const hasSeen = localStorage.getItem('garimpo_coupon_seen');
    
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000); // Aparece após 4 segundos
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('garimpo_coupon_seen', 'true');
  };

  const copyCode = () => {
    navigator.clipboard.writeText('GARIMPO10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.ticketContainer}
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {/* Botão Fechar no Canto */}
            <button onClick={handleClose} className={styles.closeBtn}>✕</button>

            {/* LADO ESQUERDO (DECORATIVO) */}
            <div className={styles.ticketLeft}>
              <span className={styles.verticalText}>ADMIT ONE</span>
              <div className={styles.holeTop}></div>
              <div className={styles.holeBottom}></div>
            </div>

            {/* LINHA PONTILHADA DE CORTE */}
            <div className={styles.tearLine}>
              <span className={styles.scissor}>✂</span>
            </div>

            {/* LADO DIREITO (CONTEÚDO) */}
            <div className={styles.ticketRight}>
              <h2 className={styles.title}>
                GANHE <br/> <span className={styles.highlight}>10% OFF</span>
              </h2>
              <p className={styles.subtitle}>
                Use esse cupom na sua primeira compra e garanta aquele lookinho.
              </p>

              <div className={styles.codeBox} onClick={copyCode}>
                <span className={styles.codeLabel}>SEU CÓDIGO:</span>
                <strong className={styles.codeText}>GARIMPO10</strong>
                <span className={styles.copyIcon}>
                  {copied ? 'COPIADO! ✔' : '❐'}
                </span>
              </div>

              <button onClick={handleClose} className={styles.shopBtn}>
                BORA GASTAR!
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}