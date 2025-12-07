'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const result = await login(email, password);

    if (result.success) {
      router.push('/account');
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
      await login(email, password);
      router.push('/account');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <main className={styles.main}>

      {/* CONTAINER PRINCIPAL (Com classe condicional para animação CSS) */}
      <div className={`${styles.container} ${!isLogin ? styles.activePanel : ''}`}>

        {/* --- FORMULÁRIO DE CADASTRO (SIGN UP) --- */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleRegister}>
            <h1 className={styles.title}>CRIAR CONTA</h1>
            <div className={styles.socialContainer}>
              <button type="button" className={styles.socialBtn}>G</button>
              <button type="button" className={styles.socialBtn}></button>
            </div>
            <span className={styles.divider}>ou use seu e-mail para se registrar</span>

            <div className={styles.inputGroup}>
              <input name="name" type="text" placeholder="NOME" className={styles.input} required />
              <input name="email" type="email" placeholder="E-MAIL" className={styles.input} required />
              <input name="password" type="password" placeholder="SENHA" className={styles.input} required />
            </div>

            {error && !isLogin && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}

            <button type="submit" className={styles.actionBtn} disabled={loading}>
              {loading ? 'CARREGANDO...' : 'CADASTRAR'}
            </button>
          </form>
        </div>

        {/* --- FORMULÁRIO DE LOGIN (SIGN IN) --- */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h1 className={styles.title}>BEM-VINDO DE VOLTA</h1>
            <div className={styles.socialContainer}>
              <button type="button" className={styles.socialBtn}>G</button>
              <button type="button" className={styles.socialBtn}></button>
            </div>
            <span className={styles.divider}>ou use sua conta</span>

            <div className={styles.inputGroup}>
              <input name="email" type="email" placeholder="E-MAIL" className={styles.input} required />
              <input name="password" type="password" placeholder="SENHA" className={styles.input} required />
            </div>

            {error && isLogin && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}

            <Link href="#" className={styles.forgotPass}>Esqueceu sua senha?</Link>
            <button type="submit" className={styles.actionBtn} disabled={loading}>
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>
        </div>

        {/* --- OVERLAY DESLIZANTE (O Painel Visual) --- */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>

            {/* Lado Esquerdo (Visto quando quer Logar) */}
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.overlayTitle}>BEM-VINDO DE VOLTA!</h1>
              <p className={styles.overlayText}>
                Para se conectar com a GARIMPO.NOS, faça login com suas credenciais.
              </p>
              <button className={styles.ghostBtn} onClick={toggleMode}>
                ENTRAR
              </button>
            </div>

            {/* Lado Direito (Visto quando quer Cadastrar) */}
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.overlayTitle}>OLÁ, SEJA BEM VINDO.</h1>
              <p className={styles.overlayText}>
                Entre para o clã. Cadastre-se e comece sua jornada no hype.
              </p>
              <button className={styles.ghostBtn} onClick={toggleMode}>
                CADASTRAR
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
