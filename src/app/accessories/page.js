'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../shop/page.module.css'; // Reusing Shop styles
import api from '@/services/api';
import Link from 'next/link';

export default function AccessoriesPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Filtering by category name 'Acessórios'
            const response = await api.get('/products', { params: { category: 'Acessórios' } });

            const mappedProducts = response.data.data.map(p => ({
                id: p.id,
                name: p.name,
                price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price),
                category: p.category?.name || 'Acessórios',
                tag: p.is_new ? 'NEW' : null,
                imgFront: p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE',
                imgBack: p.images?.[1] || p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE'
            }));

            setProducts(mappedProducts);
        } catch (error) {
            console.error("Failed to fetch accessories", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <main className={styles.main}>

            <section className={styles.shopHero} style={{ background: '#7000ff', color: '#fff' }}>
                <h1 className={styles.mixedTitle}>
                    <span className={styles.wordSolid} style={{ color: '#fff' }}>ACESSÓRIOS</span>
                    <span className={styles.wordScript} style={{ color: '#00ffcc' }}>essenciais</span>
                </h1>
                <div className={styles.counterTag} style={{ background: '#fff', color: '#000' }}>
                    {products.length} ITENS DISPONÍVEIS
                </div>
            </section>

            <div className={styles.container} style={{ display: 'block' }}>

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
                                position: 'absolute', top: '-20px', right: '-20px',
                                fontSize: '10rem', opacity: 0.05, fontFamily: 'Oswald', pointerEvents: 'none'
                            }}>BLING</div>

                            <h3 style={{ fontFamily: 'Oswald', fontSize: '3rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                                Sem <span style={{ color: '#7000ff' }}>Acessórios</span>?
                            </h3>
                            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px' }}>
                                Estamos reabastecendo nosso estoque de correntes, bonés e anéis.
                                Volte em breve para dar aquele up no visual.
                            </p>
                            <Link href="/shop" style={{
                                padding: '15px 40px',
                                background: '#000',
                                color: '#fff',
                                textDecoration: 'none',
                                fontFamily: 'Oswald',
                                fontSize: '1.2rem',
                                border: '2px solid #000',
                                boxShadow: '4px 4px 0px #7000ff',
                                display: 'inline-block',
                                transition: 'transform 0.2s'
                            }}>
                                VER OUTRAS PEÇAS
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
