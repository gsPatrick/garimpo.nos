'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './CartConfirmationModal.module.css';
import { useCart } from '@/context/CartContext';

export default function CartConfirmationModal({ isOpen, onClose, product }) {
    const router = useRouter();
    const { toggleCart } = useCart();

    if (!isOpen || !product) return null;

    const handleOpenCart = () => {
        onClose();
        toggleCart();
    };

    return (
        <AnimatePresence>
            <div className={styles.overlay} onClick={onClose}>
                <motion.div
                    className={styles.modal}
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.tape}></div>

                    <div className={styles.content}>
                        <h2 className={styles.title}>ISSO AÍ! 🤘</h2>
                        <p className={styles.message}>
                            <strong>{product.name}</strong> já está na sua sacola.
                        </p>

                        <div className={styles.imageWrapper}>
                            <img src={product.images?.[0] || product.imgFront} alt={product.name} />
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.continueBtn} onClick={onClose}>
                                CONTINUAR COMPRANDO
                            </button>
                            <button className={styles.cartBtn} onClick={handleOpenCart}>
                                VER SACOLA ➜
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
