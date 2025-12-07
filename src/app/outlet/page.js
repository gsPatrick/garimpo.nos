'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../shop/page.module.css'; // Reusing Shop styles
import api from '@/services/api';
import Link from 'next/link';

export default function OutletPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/brands');
            // Filter brands that have images if desired, or show all
            const mappedBrands = response.data.map(b => ({
                id: b.id,
                name: b.name,
                image: b.logo || 'https://via.placeholder.com/800x800?text=NO+LOGO',
                slug: b.slug
            }));
            setBrands(mappedBrands);
        } catch (error) {
            console.error("Failed to fetch brands", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return (
        <main className={styles.main}>

            <section className={styles.shopHero} style={{ background: '#ff0055', color: '#fff' }}>
                <h1 className={styles.mixedTitle}>
                    <span className={styles.wordSolid} style={{ color: '#fff' }}>OUTLET</span>
                    <span className={styles.wordScript} style={{ color: '#000' }}>brands</span>
                    <span className={styles.wordOutline} style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}>OFF</span>
                </h1>
                <div className={styles.counterTag} style={{ background: '#fff', color: '#000' }}>
                    {brands.length} MARCAS DISPONÍVEIS
                </div>
            </section>

            <div className={styles.container} style={{ display: 'block' }}>

                <motion.div
                    className={styles.productGrid}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
                >
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} style={{ height: '200px', background: '#f0f0f0' }} />
                        ))
                    ) : brands.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>Nenhuma marca encontrada.</div>
                    ) : (
                        brands.map((brand) => (
                            <Link href={`/shop?brand=${encodeURIComponent(brand.name)}`} key={brand.id} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    background: '#fff',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        backgroundImage: `url(${brand.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} />
                                    <div style={{ padding: '15px', fontWeight: 'bold', color: '#000' }}>
                                        {brand.name}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </motion.div>
            </div>
        </main>
    );
}
