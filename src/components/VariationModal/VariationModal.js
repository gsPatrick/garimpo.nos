'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './VariationModal.module.css';
import api from '@/services/api';

export default function VariationModal({ isOpen, onClose, product, onConfirm }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            // Fetch full product details to get variations if not present
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const res = await api.get(`/products/${product.id}`);
                    const fullProduct = res.data;

                    const sizes = [...new Set(fullProduct.variations?.map(v => v.attributes.Size))].filter(Boolean);
                    const colors = [...new Set(fullProduct.variations?.map(v => v.attributes.Color))].filter(Boolean);

                    setAvailableSizes(sizes);
                    setAvailableColors(colors);
                } catch (err) {
                    console.error("Error fetching variations", err);
                } finally {
                    setLoading(false);
                }
            };

            if (!product.variations) {
                fetchDetails();
            } else {
                setAvailableSizes([...new Set(product.variations.map(v => v.attributes.Size))].filter(Boolean));
                setAvailableColors([...new Set(product.variations.map(v => v.attributes.Color))].filter(Boolean));
            }
        }
    }, [isOpen, product]);

    const handleConfirm = () => {
        if (!selectedSize || !selectedColor) return;

        // Find variation object
        // Note: We might need the full variation object. For now passing attributes.
        // Ideally we should find the variation ID.
        // Let's assume onConfirm handles the logic or we pass the attributes.
        onConfirm({ size: selectedSize, color: selectedColor });
        onClose();
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className={styles.overlay} onClick={onClose}>
                <motion.div
                    className={styles.modal}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>

                    <div className={styles.modalHeader}>
                        <img
                            src={
                                (typeof product.images?.[0] === 'string' ? product.images?.[0] : product.images?.[0]?.src) ||
                                (typeof product.imgFront === 'string' ? product.imgFront : product.imgFront?.src) ||
                                (typeof product.image === 'string' ? product.image : product.image?.src) ||
                                'https://via.placeholder.com/800x800?text=NO+IMAGE'
                            }
                            alt={product.name}
                            className={styles.productImage}
                        />
                        <h2 className={styles.title}>ESCOLHA SEU FIT</h2>
                    </div>

                    {loading ? <p>Carregando opções...</p> : (
                        <>
                            <div className={styles.group}>
                                <label>TAMANHO:</label>
                                <div className={styles.options}>
                                    {availableSizes.map(s => (
                                        <button
                                            key={s}
                                            className={`${styles.optBtn} ${selectedSize === s ? styles.active : ''}`}
                                            onClick={() => setSelectedSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.group}>
                                <label>COR:</label>
                                <div className={styles.options}>
                                    {availableColors.map(c => (
                                        <button
                                            key={c}
                                            className={`${styles.optBtn} ${selectedColor === c ? styles.active : ''}`}
                                            onClick={() => setSelectedColor(c)}
                                            // If it's a hex code, use it. If it's a name, try to use it.
                                            // Ideally we'd have the hex map here too, but let's rely on name for now or simple style
                                            style={{ borderBottom: selectedColor === c ? '3px solid #eb68b3' : '1px solid #ddd' }}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={styles.confirmBtn}
                                disabled={!selectedSize || !selectedColor}
                                onClick={handleConfirm}
                            >
                                ADICIONAR
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
