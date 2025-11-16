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

// GET: get all the users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

// DELETE: delete all the users
exports.deleteAllUsers = async (req, res, next) => {
  try {
    await User.deleteMany({});
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// GET: get a specific user by their username
exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

// PUT: update the whole user
exports.updateUserPut = async (req, res, next) => {
try {
    const { username } = req.params;
    const { email, password, institution, role, otherRoleName } = req.body;

    if (!email || !institution || !role) {
      return res.status(400).json({ error: 'Missing required fields for PUT' });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({ error: 'Invalid email format' });
    }

    const roleError = validateRoleAndInstitution({ role, institution, otherRoleName });
    if (roleError) {
      return res.status(422).json({ error: roleError });
    }

    const updates = {
      email,
      institution: institution.trim(),
      role,
      otherRoleName: role === 'other' ? otherRoleName?.trim() : undefined,
    };

    if (password) {
      if (!validatePassword(password)) {
        return res.status(422).json({
          error:
            'Password must be at least 8 characters and contain letters and numbers',
        });
      }
      updates.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await User.findOneAndUpdate({ username }, updates, {
      new: true,
      overwrite: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

// PATCH: update specific details of a user
exports.updateUserPatch = async (req, res, next) => {
    try{
        const { username } = req.params;
        const updates = { ...req.body };

        const currentUser = await User.findOne({ username });
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found'});
        }

        if (updates.email && !validateEmail(updates.email)) {
            return res.status(422).json({ error: 'Invalid email format'});
        }

        if (updates.password) {
            if (!validatePassword(updates.password)) {
                return res.status(422).json({
                    error: 'Password must be at least 8 characters and contain letters and numbers'
                });
            }
            updates.passwordHash = await bcrypt.hash(updates.password, SALT_ROUNDS);
            delete updates.password;
        }
        
        const newInstitution = updates.institution !== undefined ? updates.institution : currentUser.institution;
        const newRole = updates.role !== undefined ? updates.role : currentUser.role;
        const newOtherRoleName = updates.otherRoleName !== undefined ? updates.otherRoleName : currentUser.otherRoleName;

        const roleError = validateRoleAndInstitution({
            role: newRole,
            institution: newInstitution,
            otherRoleName: newOtherRoleName,
        });
        
        if (roleError) {
            return res.status(422).json({ error: roleError });
        }
     
        if (updates.institution) {
            updates.institution = updates.institution.trim();
        }
        if (updates.role === 'other' && updates.otherRoleName) {
           updates.otherRoleName = updates.otherRoleName.trim();
        }
     
        const user = await User.findOneAndUpdate({ username }, updates, {
            new: true,
            runValidators: true,
        }).select('-passwordHash');
     
        res.json({ data: user });

    } catch (err) {
        next(err);
    }
};

// DELETE: delete a specific user
exports.deleteUserByUsername = async (req, res, next) => {
    try {
        const {username} = req.params;
        const user = await User.findOneAndDelete({ username});

        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).send
    } catch (err) {
    next(err);
    }
};