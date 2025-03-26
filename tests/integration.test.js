const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { adminUser } = require('../src/lib/mockdata');

describe('Tests d\'Intégration', () => {
  let adminToken;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  // Tests de la route de login
  describe('POST /api/login', () => {
    it('devrait accepter des identifiants valides', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: adminUser.email,
          password: adminUser.password,
          role: adminUser.role
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('devrait rejeter des identifiants invalides', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: adminUser.email,
          password: 'wrongpass',
          role: adminUser.role
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  // Tests des routes protégées
  describe('Routes Protégées', () => {
    it('GET /api/students devrait nécessiter un token', async () => {
      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
    });

    it('POST /api/students devrait créer un nouvel étudiant', async () => {
      const newStudent = {
        username: 'testuser',
        password: 'testpass',
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        studentId: 'TEST123',
        department: 'Informatique'
      };

      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newStudent);
      
      expect(res.statusCode).toBe(201);
    });
  });
});