'use client';

import { motion } from 'framer-motion';
import ProductCard from '../ProductCard/ProductCard';
import styles from './FeaturedDrops.module.css';
import Link from 'next/link';

// Dados Mockados (Simulando API)
const DROPS = [
  {
    id: 1,
    name: "Cyber Hoodie X1",
    price: "349,90",
    category: "Heavyweight Cotton",
    tag: "NEW",
    imgFront: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    imgBack: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Acid Wash Tee",
    price: "129,90",
    category: "Oversized Fit",
    tag: "HOT",
    imgFront: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    imgBack: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Tactical Vest 2.0",
    price: "499,90",
    category: "Techwear",
    tag: null,
    imgFront: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=800&auto=format&fit=crop",
    imgBack: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Neon Beanie",
    price: "89,90",
    category: "Accessories",
    tag: "LAST UNITS",
    imgFront: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop",
    imgBack: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
  }
];

// Variantes para animação em cascata (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Cada filho aparece 0.2s depois do anterior
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function FeaturedDrops() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>A MODA DO  <span className={styles.outline}>MOMENTO</span></h2>
        <Link href="/shop" className={styles.viewAll}>
          VER TUDO →
        </Link>
      </div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // Anima quando 100px do elemento entra na tela
      >
        {DROPS.map((product) => (
          <motion.div key={product.id} variants={cardVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}