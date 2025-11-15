const bcrypt =require('bcrypt');
const User = require('../models/userModel');

// password hashign
const SALT_ROUNDS = 10;
// amount of retry for unique username
const UNQ_USR_TRY = 5;
// username character limit
const USSER_NAME_CHAR_LIMIT = 12;

// validate if it follows the email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// validate the password
function validatePassword(password) {
    return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}

// list of characters to generate username
const USERNAME_CHARS =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// generate random username, with 12 character limit
function generateUsername() {
    let username = '';
    for (let i = 0; i < USSER_NAME_CHAR_LIMIT; i++) {
        const idx = Math.floor(Math.random() * USERNAME_CHARS.length);
        username += USERNAME_CHARS[idx];
    }
    return username;
}

// create unique username, if a username exists try 5 more times
async function createUniqueUsername() {
  for (let i = 0; i < UNQ_USR_TRY; i++) {
    const candidate = generateUsername();
    const existing = await User.findOne({ username: candidate });
    if (!existing) {
      return candidate;
    }
  }
  throw new Error('Failed to generate a unique username after several attempts');
}

// list of predefied roles for user
const ALLOWED_ROLES = ['Student', 'Alumni', 'Teacher', 'TA', 'other'];

// validate institution and role input by user
function validateRoleAndInstitution({ role, institution, otherRoleName }) {
  if (!institution || typeof institution !== 'string' || !institution.trim()) {
    return 'Institution is required';
  }

  if (!role || !ALLOWED_ROLES.includes(role)) {
    return 'Role must be one of: Student, Alumni, Teacher, TA, other';
  }

  if (role === 'other') {
    if (!otherRoleName || !otherRoleName.trim()) {
      return 'otherRoleName is required when role is "other"';
    }
  }

  return null; // no error
}

// POST: create user
exports.createUser = async (req, res, next) => {
  try {
    const { email, password, institution, role, otherRoleName } = req.body;

    // check for empty fields
    if (!email || !password || !institution || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // check if the email is valid
    if (!validateEmail(email)) {
      return res.status(422).json({ error: 'Invalid email format' });
    }

    // check if the password is valid and least 8 char
    if (!validatePassword(password)) {
      return res.status(422).json({
        error:
          'Password must be at least 8 characters and contain letters and numbers',
      });
    }

    // check if institution and role
    const roleError = validateRoleAndInstitution({ role, institution, otherRoleName });
    if (roleError) {
      return res.status(422).json({ error: roleError });
    }

    // check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // hash pasword
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // create unique username
    const username = await createUniqueUsername();

    // create the user in mongoDB
    const user = await User.create({
      username,
      email,
      passwordHash,
      institution: institution.trim(),
      role,
      otherRoleName: role === 'other' ? otherRoleName.trim() : undefined,
    });

    // send response for the sucessfully created user
    res.status(201).json({
      data: {
        username: user.username,
        email: user.email,
        institution: user.institution,
        role: user.role,
        otherRoleName: user.otherRoleName,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};