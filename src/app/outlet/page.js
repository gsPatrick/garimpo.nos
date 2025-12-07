'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../shop/page.module.css'; // Reusing Shop styles
import api from '@/services/api';
import Link from 'next/link';

export default function OutletPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Assuming 'Outlet' is a category or we filter by is_outlet if backend supports it
            // For now, filtering by category name 'Outlet'
            const response = await api.get('/products', { params: { category: 'Outlet' } });

            const mappedProducts = response.data.data.map(p => ({
                id: p.id,
                name: p.name,
                price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price),
                category: p.category?.name || 'Outlet',
                tag: 'SALE',
                imgFront: p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE',
                imgBack: p.images?.[1] || p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE'
            }));

            setProducts(mappedProducts);
        } catch (error) {
            console.error("Failed to fetch outlet products", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <main className={styles.main}>

            <section className={styles.shopHero} style={{ background: '#ff0055', color: '#fff' }}>
                <h1 className={styles.mixedTitle}>
                    <span className={styles.wordSolid} style={{ color: '#fff' }}>OUTLET</span>
                    <span className={styles.wordScript} style={{ color: '#000' }}>vibes</span>
                    <span className={styles.wordOutline} style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}>OFF</span>
                </h1>
                <div className={styles.counterTag} style={{ background: '#fff', color: '#000' }}>
                    {products.length} ITENS EM PROMOÇÃO
                </div>
            </section>

            <div className={styles.container} style={{ display: 'block' }}> {/* Full width, no sidebar */}

                <motion.div
                    className={styles.productGrid}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                    {loading ? (
                        // SKELETON GRID
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} style={{
                                height: '400px',
                                background: '#f0f0f0',
                                border: '2px solid #000',
                                boxShadow: '4px 4px 0px #000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontFamily: 'Oswald', fontSize: '1.5rem', opacity: 0.5, animation: 'pulse 1s infinite' }}>LOADING...</span>
                            </div>
                        ))
                    ) : products.length === 0 ? (
                        // PREMIUM EMPTY STATE
                        <div style={{
                            gridColumn: '1 / -1',
                            border: '2px dashed #000',
                            padding: '80px',
                            textAlign: 'center',
                            background: '#fff',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', top: '-20px', left: '-20px',
                                fontSize: '10rem', opacity: 0.05, fontFamily: 'Oswald', pointerEvents: 'none'
                            }}>EMPTY</div>

                            <h3 style={{ fontFamily: 'Oswald', fontSize: '3rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                                Tudo foi <span style={{ color: '#ff0055' }}>Vendido!</span>
                            </h3>
                            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px' }}>
                                O garimpo foi intenso e não sobrou nada no Outlet por enquanto.
                                Mas não desanime, as novidades chegam a todo momento.
                            </p>
                            <Link href="/shop" style={{
                                padding: '15px 40px',
                                background: '#000',
                                color: '#fff',
                                textDecoration: 'none',
                                fontFamily: 'Oswald',
                                fontSize: '1.2rem',
                                border: '2px solid #000',
                                boxShadow: '4px 4px 0px #ff0055',
                                display: 'inline-block',
                                transition: 'transform 0.2s'
                            }}>
                                VOLTAR PARA A LOJA
                            </Link>
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </motion.div>
            </div>
        </main>
    );
}
