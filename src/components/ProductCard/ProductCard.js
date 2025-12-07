'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';
import CartConfirmationModal from '../CartConfirmationModal/CartConfirmationModal';
import VariationModal from '../VariationModal/VariationModal';
import api from '@/services/api';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVariation, setShowVariation] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.is_variable) {
      setShowVariation(true);
    } else {
      addToCart(product, 1, null, false); // false = don't open sidebar
      setShowConfirm(true);
    }
  };

  const handleVariationConfirm = async ({ size, color }) => {
    // Need to find the specific variation object to pass to addToCart
    // We might need to fetch it if not present, but let's assume we can get it or addToCart handles it
    // For now, let's fetch the full product to find the variation ID if needed, 
    // OR just pass the attributes and let CartContext handle it (if it supported it, but it likely needs a variation object with ID)

    try {
      // Quick fetch to get variations if missing (ProductCard usually has limited data)
      const res = await api.get(`/products/${product.id}`);
      const fullProduct = res.data;
      const variation = fullProduct.variations.find(v =>
        v.attributes.Size === size && v.attributes.Color === color
      );

      if (variation) {
        addToCart(product, 1, variation, false); // false = don't open sidebar
        setShowConfirm(true);
      } else {
        alert('Variação indisponível no momento.');
      }
    } catch (err) {
      console.error("Error adding variation", err);
    }
  };

  return (
    <>
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

            <img src={product.imgFront || product.images?.[0]} alt={product.name} className={styles.imgFront} />

            <motion.img
              src={product.imgBack || product.images?.[1] || product.images?.[0]}
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

      <CartConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        product={product}
      />

      <VariationModal
        isOpen={showVariation}
        onClose={() => setShowVariation(false)}
        product={product}
        onConfirm={handleVariationConfirm}
      />
    </>
  );
}