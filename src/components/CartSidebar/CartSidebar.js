'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import styles from './CartSidebar.module.css';
import Link from 'next/link';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, removeItem, updateQuantity, subtotal } = useCart();

  // Lógica da Barra de Frete (FRETE GRÁTIS PARA TODOS)
  // const FREE_SHIPPING_THRESHOLD = 500;
  // const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  // const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* O Carrinho (Folha de Papel) */}
          <motion.div
            className={styles.sidebar}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >

            {/* HEADER */}
            <div className={styles.header}>
              <h2>
                <span className={styles.headerSolid}>SUA</span>
                <span className={styles.headerScript}>Sacola</span>
              </h2>
              <button onClick={toggleCart} className={styles.closeBtn}>✕</button>
            </div>

            {/* BARRA DE FRETE REMOVIDA */}

            {/* LISTA DE ITENS */}
            <div className={styles.itemsList}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.sadFace}>:(</div>
                  <h3>SACOLA VAZIA?</h3>
                  <p>Corre pro garimpo antes que acabem as peças!</p>
                  <button onClick={toggleCart} className={styles.shopBtn}>VOLTAR PRA LOJA</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div layout key={item.id} className={styles.itemCard}>
                    <div className={styles.imgWrapper}>
                      <img src={typeof item.image === 'string' ? item.image : (item.image?.src || 'https://via.placeholder.com/150')} alt={item.name} />
                    </div>

                    <div className={styles.itemInfo}>
                      <div className={styles.infoTop}>
                        <h4>{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className={styles.removeBtn}>
                          🗑
                        </button>
                      </div>

                      <p className={styles.variant}>{item.color} / {item.size}</p>

                      <div className={styles.infoBottom}>
                        <div className={styles.qtyControl}>
                          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                        <span className={styles.price}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* FOOTER (CHECKOUT) */}
            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span>SUBTOTAL:</span>
                  <span className={styles.totalPrice}>R$ {subtotal.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className={styles.checkoutBtn} onClick={toggleCart}>
                  FINALIZAR COMPRA ➜
                </Link>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}