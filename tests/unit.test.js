const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../server');
const { adminUser } = require('../src/lib/mockdata');

describe('Tests Unitaires', () => {
  // Tests de validation de mot de passe
  describe('Password Hashing and Validation', () => {
    it('devrait valider un mot de passe correct', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      const isValid = await bcrypt.compare('password123', hashed);
      expect(isValid).toBe(true);
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      const isValid = await bcrypt.compare('wrongpass', hashed);
      expect(isValid).toBe(false);
    });
  });

  // Tests de génération de token JWT
  describe('JWT Token Generation', () => {
    it('devrait générer un token valide', () => {
      const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('devrait vérifier correctement un token', () => {
      const payload = { id: '123', role: 'admin' };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(payload.id);
    });
  });

  // Tests de connexion à la base de données
  describe('Database Connection', () => {
    it('devrait se connecter à la base de données', async () => {
      const res = await pool.query('SELECT NOW()');
      expect(res.rows).toBeDefined();
    });
  });
});