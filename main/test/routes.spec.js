/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
// const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../index');

chai.use(chaiHttp);

describe('Routes', () => {
  let updateModel; let skillIdsModel;
  describe('GET /users', () => {
    it('Successfully return all users array', async () => chai.request(server)
      .get('/users')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));
  });

  describe('GET /skills', () => {
    it('Successfully return all skills array', async () => chai.request(server)
      .get('/skills')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));
  });

  describe('GET /userWithSkill', () => {
    it('Successfully return all userWithSkills array', async () => chai.request(server)
      .get('/userWithSkill')
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.status).to.be.equal(200);
      }));
  });

  describe('POST /create', () => {
    it('successfully created users & skills', async () => {
      const userModel = {
        name: 'ABCDSEfg',
        email: 'ABCDSEfg2324@gmail.com',
        age: '25',
        contact: '9876543217',
        gender: 'male',
        birthdate: '2003-03-12T18:30:00.000',
        city: 'Ahmedabad',
        skillIds: [ 101, 102 ]
      };
      return chai.request(server)
        .post('/create')
        .send(userModel)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('msg');
        });
    });
  });

  describe('GET /sort', () => {
    it('Successfully return sorted users', async () => chai.request(server)
      .get('/sort?sortField=name&sortOrder=ASC')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));

    it('Return validation failed error', async () => chai.request(server)
      .get('/sort?sortField=contact&sortOrder=ASC')
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
      }));
  });

  describe('GET /searchUserByNameAndemail', () => {
    it('Successfully return user', async () => chai.request(server)
      .get('/search?name=Sami&email=sami@gmail.com')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));

    it('Return not found error', async () => chai.request(server)
      .get('/search?name=example&email=example@gmail.com')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
      }));
  });

  describe('GET /birthdayUsers', () => {
    it('Successfully return birthday users', async () => chai.request(server)
      .get('/birthday')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));
  });

  describe('PUT /updateUserById', () => {
    beforeEach(() => {
      updateModel = {
        name: 'ABdCefg',
        email: 'ABdCegf@gmail.com',
        age: '25',
        contact: '9876543217',
        gender: 'male',
        birthdate: '2003-03-12T18:30:00.000',
        city: 'Ahmedabad'
      };
    });
    it('Successfully update user by Id', async () => chai.request(server)
      .put('/update/1')
      .send(updateModel)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('msg');
      }));
    it('Return not found error', async () => chai.request(server)
      .put('/update/3645')
      .send(updateModel)
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
      }));
  });

  describe('GET /get Users By Match Skills', () => {
    it('Successfully get user by match skills', async () => chai.request(server)
      .get('/matchData?skills=HTML,CSS,JS')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
      }));

    it('Return Not found error', async () => chai.request(server)
      .get('/matchData?skills=angular')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
      }));
  });

  describe('PUT /add Skills In User By Id', () => {
    beforeEach(() => {
      skillIdsModel = {
        skillIds: [ 104 ]
      };
    });

    it('successfully add skills in user', async () => chai.request(server)
      .put('/addSkill/3')
      .send(skillIdsModel)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('msg');
      }));

    it('return Error when skill_id already present in user', async () => chai.request(server)
      .put('/addSkill/3')
      .send(skillIdsModel)
      .then((res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.have.property('error');
      }));

    it('Return not found error', async () => chai.request(server)
      .put('/addSkill/2345')
      .send(skillIdsModel)
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
      }));
  });

  describe('DELETE /remove Skills In User By Id', () => {
    beforeEach(() => {
      skillIdsModel = {
        skillIds: [ 104 ]
      };
    });

    it('successfully remove skills in user', async () => chai.request(server)
      .delete('/removeSkill/3')
      .send(skillIdsModel)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('msg');
      }));

    it('Return Not found error when skillId not present in user', async () => chai.request(server)
      .put('/removeSkill/3')
      .send(skillIdsModel)
      .then((res) => {
        expect(res.status).to.be.equal(404);
      }));
  });
});
