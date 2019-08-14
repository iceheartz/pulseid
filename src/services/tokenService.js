require('dotenv').config();
const Sequelize = require('sequelize');
const _ = require('lodash');

const { _randToken } = require('../helpers/helpers')

const env = process.env;

const sequelize = new Sequelize(env.MYSQL_DB, env.MYSQL_USER, env.MYSQL_PASS, {
  dialect: 'mysql',
  host: env.MYSQL_HOST,
});

const Op = Sequelize.Op;

const db = sequelize.define('tokens', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  // usage:{
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  // maxUsage:{
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  status: {
    type: Sequelize.ENUM('active', 'inactive'),
    allowNull: false
  }
});

const createToken = (payload) => {
  const charLen = _.get(payload, 'tokenLength', undefined)
  if( charLen === undefined || charLen < 6 || charLen > 12) {
    throw new Error('Invalid character Length');
  }
  
  const token = _randToken(charLen);
  const dbPayload = {
    token,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
  }

  return db
    .create(dbPayload)
    .then(() => {
      return { token };
    }).catch( err => {
      throw new Error(err.message);
  })
}

const validateToken = (token) => {
  return db
    .findOne({
        where: {
          token,
          createdAt: {
            [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
          },
          status: 'active'
        }
      }).then((res) => { 
        if(_.isUndefined(res) || _.isUndefined(_.get(res, 'id', undefined))){
          throw new Error('Token is invalid')
        }
        return true;
      }).catch( err => {
      throw new Error(err.message);
  });            
}

const invalidateToken = (token) => {
  return db
    .update({
      status: 'inactive'
    }, {
      where: {
        token,
      }
    }).then(() => {
      return true;
    }).catch( err => {
    throw new Error(err.message);
    });
}

const getTokens = () => {

  //Do housekeeping
  db.update({
    status: 'inactive'
  }, {
    where: {
      createdAt: {
        [Op.lt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
      },
    }
  }).catch( err => {
  throw new Error(err.message);
  });

  return db
    .findAll({
      order: ['status']
    })
    .then(tokens =>{
      return tokens
    }).catch( err => {
    throw new Error(err.message);
    });
}

module.exports = {
  db,
  createToken,
  validateToken,
  invalidateToken,
  getTokens
} 