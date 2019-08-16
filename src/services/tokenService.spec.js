const sinon = require('sinon');
const { expect } = require('chai');
const rewire = require('rewire');
const SequelizeMock = require('sequelize-mock');
const Sequelize = require('sequelize');
const _ = require('lodash');

const dbMock = new SequelizeMock();

describe('tokenService', () => { 

  let sandbox = null;
  let tokenMock = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    tokenMock = dbMock.define('tokens', {
      id:  1,
      token: 'Gf1fnc',
      createdAt: '2019-08-15T14:34:34.000Z',
      updatedAt: '2019-08-15T14:34:34.000Z',
      status: 'active'
    });
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('#createToken', () => {
    
    it('Should call create method once and return the new token', (done) => {
      const mockPayload = { token: "Gf1fnc" };
      const createSpy = sandbox.spy( tokenMock, 'create');

      tokenMock.create(mockPayload)
      .then((tn)=>{
        expect(createSpy.called).to.equal(true);
        expect(createSpy.calledOnce).to.equal(true);
        expect(tn.id).to.equal(1);
        expect(tn.token).to.equal(mockPayload.token);
        expect(tn.createdAt).to.equal("2019-08-15T14:34:34.000Z");
        expect(tn.updatedAt).to.equal("2019-08-15T14:34:34.000Z");
        expect(tn.status).to.equal("active");
        done();
      })
    })
  })

  describe('#validateToken', () => {

      it('Should call findOne method once and return token if found', (done) => {

        const Op = Sequelize.Op;
        const mockPayload = 
        {
          where: {
            token: 'Gf1fnc',
            createdAt: {
              [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            },
            status: 'active'
          }
        }

        const createSpy = sandbox.spy( tokenMock, 'findOne');

        tokenMock.findOne(mockPayload)
        .then((tn)=>{
          expect(createSpy.called).to.equal(true);
          expect(createSpy.calledOnce).to.equal(true);
          expect(tn.id).to.equal(1);
          expect(tn.token).to.equal(mockPayload.where.token);
          expect(tn.status).to.equal("active");
          done();
        })
              
      })
  })  
  
  describe('#invalidateToken', () => {

    it('Should call update method once', (done) => {

      const token = 'Gf1fnc'
      const createSpy = sandbox.spy( tokenMock, 'update');

      tokenMock.update({
        status: 'inactive'
      }, {
        where: {
          token
        }
      })
      .then(()=>{
        expect(createSpy.called).to.equal(true);
        expect(createSpy.calledOnce).to.equal(true);
        done();
      })
            
    })
  })  

  describe('#getTokens', () => {

    it('Should call findAll method once and return all tokens', (done) => {
      const createSpy = sandbox.spy( tokenMock, 'findAll');
      const token = 'Gf1fnc'

      tokenMock.findAll({
        order: ['status']
      })
      .then(([tn])=>{
        expect(createSpy.called).to.equal(true);
        expect(createSpy.calledOnce).to.equal(true);
        expect(tn.id).to.equal(1);
        expect(tn.token).to.equal(token);
        expect(tn.createdAt).to.equal("2019-08-15T14:34:34.000Z");
        expect(tn.updatedAt).to.equal("2019-08-15T14:34:34.000Z");
        expect(tn.status).to.equal("active");
        done();
      })
    }) 
  })
})