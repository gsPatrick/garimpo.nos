'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/SearchOverlay/SearchOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, cartItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        
        {/* HAMBURGUER (MOBILE) - ESQUERDA */}
        <button 
          className={styles.hamburger} 
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* LOGO (IMAGEM) CENTRALIZADO */}
        <div className={styles.logo}>
          <Link href="/">
            {/* Logo Imagem Grande */}
            <img src="/logo.png" alt="Garimpo.Nós" className={styles.logoImg} />
          </Link>
        </div>
        
        {/* NAV DESKTOP */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>Início</Link>
          <Link href="/shop" className={styles.link}>Loja</Link>
          <Link href="/collections" className={styles.link}>Outlet</Link> 
          <Link href="/lookbook" className={styles.link}>Acessórios</Link>
          <Link href="/founder" className={styles.link}>Fundadora</Link>
          <Link href="/about" className={styles.link}>Sobre-nos</Link>
        </nav>
        
        {/* AÇÕES (DIREITA) */}
        <div className={styles.actions}>
          
          <button onClick={() => setIsSearchOpen(true)} className={styles.iconBtn} title="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <Link href="/account" className={styles.iconBtn} title="Minha Conta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>

          {/* Botão de Tema (Ainda troca o site, mas o ícone fica branco pois o header é dark) */}
          <button onClick={toggleTheme} className={styles.iconBtn} title="Mudar Tema">
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          
          {/* CARRINHO */}
          <button onClick={toggleCart} className={styles.cartBtn} title="Abrir Carrinho">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className={styles.cartCount}>({cartItems.length})</span>
          </button>
        </div>
      </header>

      {/* MENU MOBILE (TAMBÉM ESCURO) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.mobileHeader}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <img src="/logo.png" alt="Garimpo.Nós" className={styles.mobileLogoImg} />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className={styles.closeMenuBtn}>✕</button>
            </div>

            <div className={styles.mobileActionsRow}>
              <button onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }} className={styles.mobileIconBtn}>
                BUSCAR 🔍
              </button>
              <Link href="/account" className={styles.mobileIconBtn} onClick={() => setMobileMenuOpen(false)}>
                CONTA 👤
              </Link>
              <button onClick={toggleTheme} className={styles.mobileIconBtn}>
                {theme === 'dark' ? 'LUZ ☀' : 'DARK ☾'}
              </button>
            </div>

            <nav className={styles.mobileNav}>
              {[
                { name: 'Início', path: '/' },
                { name: 'Loja', path: '/shop' },
                { name: 'Outlet', path: '/collections' },
                { name: 'Acessórios', path: '/lookbook' },
                { name: 'Fundadora', path: '/founder' }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={item.path}
                    className={styles.mobileLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className={styles.mobileFooter}>
              <span>GARIMPO.NÓS © 2025</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}