'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const user = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: String,
  approvals: [{
    type: Schema.Types.ObjectId,
    ref: 'Installment'
  }],
  role: {type: String, default: 'base'}
});

//use when check needs to be made of user existence
user.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

user.statics.changeApprovals = function(array1, array2, id) {
  return this.findById(id)
    .select('-password')
    .then(user => {
    if(!user) throw {status: 400, message: 'User Not Found.'};
    user.approvals.push(...array1);
    return user.save();
  })
    .then(user => {
      return user.update({$pull: {approvals: {$in: array2}}}).lean().select('-password');
    });
};

user.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};

user.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);
