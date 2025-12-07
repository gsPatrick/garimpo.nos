'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const result = await login(email, password);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    const result = await register({ name, email, password });

    if (result.success) {
      // Após registrar, faz login automático ou pede para logar
      // Aqui vamos fazer login automático
      await login(email, password);
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${styles.modalContainer} ${!isLoginView ? styles.activePanel : ''}`}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >

        {/* --- FORMULÁRIO DE CADASTRO (SIGN UP) --- */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleRegister}>
            <h1 className={styles.title}>CRIAR CONTA</h1>

            <div className={styles.socialContainer}>
              <button type="button" className={styles.socialBtn}>G</button>
              <button type="button" className={styles.socialBtn}></button>
            </div>

            <span className={styles.divider}>ou use seu e-mail</span>

            <input name="name" type="text" placeholder="SEU NOME" className={styles.input} required />
            <input name="email" type="email" placeholder="E-MAIL" className={styles.input} required />
            <input name="password" type="password" placeholder="CRIE UMA SENHA" className={styles.input} required />

            {error && !isLoginView && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}

            <button type="submit" className={styles.actionBtn} disabled={loading}>
              {loading ? 'CARREGANDO...' : 'CADASTRAR ➜'}
            </button>
          </form>
        </div>

        {/* --- FORMULÁRIO DE LOGIN (SIGN IN) --- */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h1 className={styles.title}>BEM-VINDA(O)</h1>

            <div className={styles.socialContainer}>
              <button type="button" className={styles.socialBtn}>G</button>
              <button type="button" className={styles.socialBtn}></button>
            </div>

            <span className={styles.divider}>ou entre com sua conta</span>

            <input name="email" type="email" placeholder="E-MAIL" className={styles.input} required />
            <input name="password" type="password" placeholder="SENHA" className={styles.input} required />

            {error && isLoginView && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}

            <a href="#" className={styles.forgotPass}>Esqueceu a senha?</a>

            <button type="submit" className={styles.actionBtn} disabled={loading}>
              {loading ? 'ENTRANDO...' : 'ENTRAR ➜'}
            </button>
          </form>
        </div>

        {/* --- OVERLAY DESLIZANTE (Painel Colorido) --- */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>

            {/* Lado Esquerdo (Visto quando quer ir para Login) */}
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h2 className={styles.overlayTitle}>
                JÁ É DO <br /> <span className={styles.scriptWhite}>Clube?</span>
              </h2>
              <p className={styles.overlayText}>
                Faça login para acessar seus pedidos, cupons e finalizar suas compras.
              </p>
              <button className={styles.ghostBtn} onClick={() => { setIsLoginView(true); setError(''); }}>
                QUERO ENTRAR
              </button>
            </div>

            {/* Lado Direito (Visto quando quer ir para Cadastro) */}
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h2 className={styles.overlayTitle}>
                PRIMEIRA <br /> <span className={styles.scriptWhite}>Vez?</span>
              </h2>
              <p className={styles.overlayText}>
                Cadastre-se agora e garanta acesso antecipado aos drops e descontos exclusivos.
              </p>
              <button className={styles.ghostBtn} onClick={() => { setIsLoginView(false); setError(''); }}>
                QUERO CADASTRAR
              </button>
            </div>

          </div>
        </div>

        {/* Botão fechar (Caso queira apenas olhar o site sem logar) */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

      </motion.div>
    </motion.div>
  );
}