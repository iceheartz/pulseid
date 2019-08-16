const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const { mockReq, mockRes } = require('sinon-express-mock');

chai.use(sinonChai);

describe('tokenController', () => {

  let unit;
  let res
  let tokenServiceMock;

  beforeEach(() => {
    unit = rewire('./tokenController');
    tokenServiceMock = unit.__get__('tokenService');
    res = mockRes();
  });

  describe('#createToken', () => {

    it('Should return 200 with a new token if token is created successfully with authorized user', async () => {
      const mockPayload = { "tokenLength": 6 }

      const req = mockReq({ body: mockPayload, user: { id: 1 } });

      const mockReturn = { token : 'mock12'};
      tokenServiceMock.createToken = sinon.spy(() => Promise.resolve(mockReturn));
      const result = await unit.createToken(req, res);

      expect(tokenServiceMock.createToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(200);
      expect(result.json).to.be.calledWith(mockReturn)

    })

    it('Should return 401 with error message if accessed by unauthorized user', async () => {
      const mockPayload = { "tokenLength": 6 }

      const req = mockReq({ body: mockPayload, user: { id: undefined } });

      const mockReturn = { message : 'Unauthorized Access'};
      const result = await unit.createToken(req, res);

      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(401);
      expect(result.json.lastCall.args[0]).to.eql(mockReturn);

    })

    it('Should return 400 with error message if token length is less than 6 with accessed by authorized user', async () => {
      const mockPayload = { "tokenLength": 5 }

      const req = mockReq({ body: mockPayload, user: { id: 1 } });

      const errorMsg = 'Invalid character Length';
      tokenServiceMock.createToken = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.createToken(req, res);

      expect(tokenServiceMock.createToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })

    it('Should return 400 with error message if token length is more than 12 with accessed by authorized user', async () => {
      const mockPayload = { "tokenLength": 13 }

      const req = mockReq({ body: mockPayload, user: { id: 1 } });

      const errorMsg = 'Invalid character Length';
      tokenServiceMock.createToken = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.createToken(req, res);

      expect(tokenServiceMock.createToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })
 
  })

  describe('#validateToken', () => {
    it('Should return 200 with true if token is found', async() => {

      const req = mockReq({ params: { token : 'mock12'}  });

      const mockReturn = true
      tokenServiceMock.validateToken = sinon.spy(() => Promise.resolve(mockReturn));
      const result = await unit.validateToken(req, res);

      expect(tokenServiceMock.validateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(200);
      expect(result.send.lastCall.args[0]).to.equal(mockReturn)
    })

    it('Should return 400 with error message if token is not found', async() => {
      
      const req = mockReq({ params: { token : 'invalidToken'}  });

      const errorMsg = 'Invalid token';
      tokenServiceMock.validateToken  = sinon.spy(() => { throw new Error(errorMsg) });
      const result = await unit.validateToken(req, res);

      expect(tokenServiceMock.validateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })

    it('Should return 400 with error message if token length is less than 6', async() => {
      
      const req = mockReq({ params: { token : '12345'}  });

      const errorMsg = 'Invalid token';
      tokenServiceMock.validateToken  = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.validateToken(req, res);

      expect(tokenServiceMock.validateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })

    it('Should return 400 with error message if token length is more than 12', async() => {
      
      const req = mockReq({ params: { token : '123456789abcd'}  });

      const errorMsg = 'Invalid token';
      tokenServiceMock.validateToken  = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.validateToken(req, res);

      expect(tokenServiceMock.validateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );

    })
  })  

  describe('#invalidateToken', () => {

    it('Should return 200 with true if token status to changed to invalid successfully and accessed by authorized user', async() => {

      const req = mockReq({ params: { token : 'mock12'}, user: { id: 1 } });

      const mockReturn = true
      tokenServiceMock.invalidateToken = sinon.spy(() => Promise.resolve(mockReturn));
      const result = await unit.invalidateToken(req, res);

      expect(tokenServiceMock.invalidateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(200);
      expect(result.send.lastCall.args[0]).to.equal(mockReturn)
    })

    it('Should return 401 with error message if accessed by unauthorized user', async () => {
      
      const req = mockReq({ params: { token : 'mock12'}, user: { id: undefined }   });

      const mockReturn = { message : 'Unauthorized Access'};
      const result = await unit.invalidateToken(req, res);

      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(401);
      expect(result.json.lastCall.args[0]).to.eql(mockReturn);

    })

    it('Should return 400 with error message if token length is less than 6 and accessed by authorized user', async() => {
      
      const req = mockReq({ params: { token : '12345'}, user: { id: 1 }  });

      const errorMsg = 'Invalid token';
      tokenServiceMock.invalidateToken  = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.invalidateToken(req, res);

      expect(tokenServiceMock.invalidateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })

    it('Should return 400 with error message if token length is more than 12 and accessed by authorized user', async() => {
      
      const req = mockReq({ params: { token : '123456789abcd'}, user: { id: 1 }  });

      const errorMsg = 'Invalid token';
      tokenServiceMock.invalidateToken  = sinon.spy(() => Promise.reject(new Error(errorMsg)));
      const result = await unit.invalidateToken(req, res);

      expect(tokenServiceMock.invalidateToken.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(400);
      expect(result.json.lastCall.args[0]).to.eql( { message : errorMsg } );
    })

  })  
  
  describe('#invalidateToken', () => {

    it('Should return 200 with all token if accessed by authorized user', async() => {

      const req = mockReq({ user: { id: 1 } });
      const mockReturn = 
      [
        {
            "id": 1,
            "token": "Gf1fnc",
            "createdAt": "2019-08-15T14:34:34.000Z",
            "updatedAt": "2019-08-15T14:34:34.000Z",
            "status": "active"
        },
        {
            "id": 2,
            "token": "StObf9",
            "createdAt": "2019-08-15T14:34:42.000Z",
            "updatedAt": "2019-08-15T14:34:42.000Z",
            "status": "active"
        }
      ]

      tokenServiceMock.getTokens = sinon.spy(() => Promise.resolve(mockReturn));
      const result = await unit.getTokens(req, res);

      expect(tokenServiceMock.getTokens.callCount).to.equal(1);
      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(200);
      expect(result.json.lastCall.args[0]).to.equal(mockReturn)
    })

    it('Should return 401 with error message if accessed by unauthorized user', async () => {
      
      const req = mockReq({ user: { id: undefined } });

      const mockReturn = { message : 'Unauthorized Access'};
      const result = await unit.invalidateToken(req, res);

      expect(typeof result === 'object').to.equal(true);
      expect(result.status.lastCall.args[0]).to.equal(401);
      expect(result.json.lastCall.args[0]).to.eql(mockReturn);

    })
  })
  
})