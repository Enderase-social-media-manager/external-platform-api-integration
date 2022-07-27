import { makeUserData } from '../models/user.js';

export function getUserData(req, res) {
  makeUserData(req, res);
}
