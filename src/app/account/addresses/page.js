'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './addresses.module.css';
import api from '@/services/api';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/addresses');
        setAddresses(response.data);
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      await api.delete(`/users/addresses/${addressToDelete}`);
      setAddresses(addresses.filter(addr => addr.id !== addressToDelete));
      setAddressToDelete(null);
    } catch (error) {
      console.error("Failed to delete address", error);
      alert('Erro ao excluir endereço.');
    }
  };

  if (loading) return <p>Carregando endereços...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>LOCALIZAÇÕES <span className={styles.highlight}>SALVAS</span></h1>
        <button className={styles.addBtn}>+ NOVO ENDEREÇO</button>
      </div>

      <div className={styles.grid}>
        {addresses.length === 0 ? (
          <p>Nenhum endereço salvo.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className={styles.addressCard}>
              {addr.isDefault && <div className={styles.tag}>PADRÃO</div>}
              <h3>{addr.name || 'Endereço'}</h3>
              <p>{addr.street}</p>
              <p>{addr.city} - {addr.state}</p>
              <p>CEP: {addr.zip}</p>

              <div className={styles.actions}>
                <button>EDITAR</button>
                <button onClick={() => setAddressToDelete(addr.id)}>EXCLUIR</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      <AnimatePresence>
        {addressToDelete && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <h3>TEM CERTEZA?</h3>
              <p>Essa ação não pode ser desfeita. O endereço será removido permanentemente.</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setAddressToDelete(null)}>CANCELAR</button>
                <button className={styles.confirmBtn} onClick={confirmDelete}>SIM, EXCLUIR</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
