export function storeUser(username) {
  localStorage.setItem('user', JSON.stringify({ username }))
};

export function getUser() {
  localStorage.getItem('user')
};

export function deleteUser() {
  localStorage.removeItem('user')
};
