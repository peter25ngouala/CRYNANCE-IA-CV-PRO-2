import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          createdAt: new Date()
        });
        alert("Compte créé avec succès !");
      }
      window.location.href = '/'; // Redirige vers l'accueil après connexion
    } catch (err) {
      setError("Erreur : " + err.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#007bff' }}>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Ton Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Ton Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isLogin ? 'Se connecter' : "Créer mon compte"}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', marginTop: '20px', color: '#555', fontSize: '14px' }}>
        {isLogin ? "Pas encore de compte ? Inscris-toi ici" : "Tu as déjà un compte ? Connecte-toi"}
      </p>
    </div>
  );
};

export default Auth;
