// Stores user in the localStorage
export function storeUser(username) {
  localStorage.setItem('user', JSON.stringify({ username }))
};

// Gets user from the localStorage
export function getUser() {
  localStorage.getItem('user')
};

// Deletes user from the localStorage
export function deleteUser() {
  localStorage.removeItem('user')
};
