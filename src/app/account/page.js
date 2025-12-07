'use client';

import { useState, useEffect } from 'react';
import styles from './account.module.css';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, login } = useAuth(); // login usado para atualizar o user no contexto
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data;
        const [first, ...rest] = (userData.name || '').split(' ');

        setFormData({
          firstName: first || '',
          lastName: rest.join(' ') || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await api.put('/users/profile', {
        name: fullName,
        phone: formData.phone
      });

      // Atualiza contexto se necessário (depende da implementação do AuthContext)
      // login(response.data.token, response.data.user); 

      setMessage('Perfil atualizado com sucesso! ★');
    } catch (error) {
      console.error("Update failed", error);
      setMessage('Erro ao atualizar perfil.');
    }
  };

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>MEU <span className={styles.highlight}>PERFIL</span></h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>PRIMEIRO NOME</label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.group}>
            <label>SOBRENOME</label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>ENDEREÇO DE E-MAIL</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            className={styles.input}
            disabled
          />
        </div>

        <div className={styles.group}>
          <label>TELEFONE (WHATSAPP)</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.saveBtn}>SALVAR ALTERAÇÕES</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
}
