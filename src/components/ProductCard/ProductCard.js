'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  
  // Função decorativa do botão
  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    alert(`Sticker colado! ${product.name} foi pra sacola! 💖`);
  };

  return (
    // O SEGREDO ESTÁ AQUI: O Link aponta para o ID do produto
    <Link href={`/product/${product.id}`} className={styles.linkWrapper}>
      <motion.div 
        className={styles.card}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className={styles.tape}></div>

        <div className={styles.imageContainer}>
          {product.tag && (
            <span className={styles.tagSticker}>{product.tag}</span>
          )}

          <img src={product.imgFront} alt={product.name} className={styles.imgFront} />
          
          <motion.img 
            src={product.imgBack} 
            alt={product.name} 
            className={styles.imgBack}
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          />

          <motion.button 
            className={styles.addBtn}
            onClick={handleAddToCart}
            variants={{ rest: { y: '100%' }, hover: { y: 0 } }}
          >
            QUERO +
          </motion.button>
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{product.name}</h3>
            <span className={styles.price}>{product.price}</span>
          </div>
          <p className={styles.category}>{product.category}</p>
        </div>
      </motion.div>
    </Link>
  );
}