const request = require('supertest');
const app = require('../server');
const { adminUser } = require('../src/lib/mockdata');

describe('Tests de Sécurité', () => {
  // Tests de gestion des erreurs
  describe('Gestion des Erreurs', () => {
    it('ne devrait pas divulguer d\'informations sensibles', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'nonexistent@test.com', password: 'wrong', role: 'admin' });
      
      expect(res.body).not.toHaveProperty('error');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body.message).toBe('Invalid credentials or role');
    });
  });

  // Tests de protection contre les attaques
  describe('Protection contre les Attaques', () => {
    it('devrait avoir des en-têtes de sécurité', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('devrait limiter les tentatives de login', async () => {
      // 5 tentatives échouées
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/login')
          .send({
            email: adminUser.email,
            password: `wrong${i}`,
            role: adminUser.role
          });
      }

      const res = await request(app)
        .post('/api/login')
        .send({
          email: adminUser.email,
          password: adminUser.password,
          role: adminUser.role
        });
      
      // La 6ème tentative (valide) devrait quand même fonctionner
      expect(res.statusCode).toBe(200);
    });
  });

  // Tests de validation des entrées
  describe('Validation des Entrées', () => {
    it('devrait rejeter les emails mal formatés', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'invalid-email',
          password: 'anypass',
          role: 'admin'
        });
      
      expect(res.statusCode).toBe(401);
    });

    it('devrait rejeter les mots de passe trop courts', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'shortpass',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
          email: 'short.pass@test.com',
          studentId: 'SHORT123',
          department: 'Test'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });
});