import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const translations = {
  en: {
    title: 'Tailor Access',
    subtitle: 'Enter your unique access code to view orders',
    label: 'Security Code',
    placeholder: 'Enter password',
    button: 'Access Dashboard',
    back: '← Return to selection'
  },
  hi: {
    title: 'दर्जी लॉगिन',
    subtitle: 'ऑर्डर देखने के लिए अपना एक्सेस कोड दर्ज करें',
    label: 'सुरक्षा कोड',
    placeholder: 'पासवर्ड दर्ज करें',
    button: 'डैशबोर्ड एक्सेस करें',
    back: '← चयन पर वापस जाएं'
  },
  ml: {
    title: 'തയ്യൽക്കാരൻ ലോഗിൻ',
    subtitle: 'ഓർഡറുകൾ കാണാൻ നിങ്ങളുടെ ആക്സസ് കോഡ് നൽകുക',
    label: 'സുരക്ഷാ കോഡ്',
    placeholder: 'പാസ്‌വേഡ് നൽകുക',
    button: 'ഡാഷ്ബോർഡ് ആക്സസ് ചെയ്യുക',
    back: '← തിരഞ്ഞെടുപ്പിലേക്ക് മടങ്ങുക'
  }
};

const TailorLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');

  const t = translations[lang];

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/tailor', { password });
      alert(`Welcome ${res.data.tailorName}`);
      localStorage.setItem('tailorName', res.data.tailorName);
      navigate('/tailor-dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="lang-switcher">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
          <button className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>हिंदी</button>
          <button className={lang === 'ml' ? 'active' : ''} onClick={() => setLang('ml')}>മലയാളം</button>
        </div>

        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>

        <div className="input-group">
          <label>{t.label}</label>
          <input
            type="password"
            placeholder={t.placeholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && login()}
          />
        </div>

        <button className="login-button" onClick={login}>{t.button}</button>

        <div className="back-home" onClick={() => navigate('/')}>
          {t.back}
        </div>
      </div>
    </div>
  );
};

export default TailorLogin;
