(function () {
    const USERS_KEY = 'users'; // array of user objects
    const LOGGED_KEY = 'loggedInUserEmail'; // current user email
    const UPDATED_MARKER = 'profileLastUpdated';
  
    const form = document.getElementById('profile-form');
    if (!form) return;
    const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
    const editBtn = document.getElementById('edit-profile');
    const saveBtn = document.getElementById('save-profile');
    const cancelBtn = document.getElementById('cancel-edit');
    const deleteBtn = document.getElementById('delete-profile');
  
    function getUsers() {
      try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
    }
    function setUsers(arr) {
      localStorage.setItem(USERS_KEY, JSON.stringify(arr));
      localStorage.setItem(UPDATED_MARKER, Date.now().toString());
      // notify same-window listeners
      window.dispatchEvent(new Event('profilesUpdated'));
    }
    function getLoggedEmail() { return localStorage.getItem(LOGGED_KEY); }
  
    function findCurrentUser() {
      const email = getLoggedEmail();
      if (!email) return null;
      return getUsers().find(u => u.email === email) || null;
    }
  
    function populateForm(user) {
      inputs.forEach(i => {
        if (!i.name) return;
        i.value = user && user[i.name] !== undefined ? user[i.name] : '';
      });
      setDisabled(true);
    }
  
    function setDisabled(disabled) {
      inputs.forEach(i => i.disabled = !!disabled);
      editBtn.style.display = disabled ? 'inline-block' : 'none';
      saveBtn.style.display = disabled ? 'none' : 'inline-block';
      cancelBtn.style.display = disabled ? 'none' : 'inline-block';
    }
  
    function saveProfile(e) {
      e && e.preventDefault();
      const emailInput = form.querySelector('input[name="email"]');
      if (!emailInput || !emailInput.value.trim()) { alert('Email is required.'); return; }
  
      const users = getUsers();
      const loggedEmail = getLoggedEmail();
      const index = users.findIndex(u => u.email === loggedEmail);
  
      const updated = {};
      inputs.forEach(i => { if (i.name) updated[i.name] = i.value; });
  
      if (index >= 0) {
        users[index] = Object.assign({}, users[index], updated);
        // if email changed, update logged key so session continues
        if (updated.email && updated.email !== loggedEmail) localStorage.setItem(LOGGED_KEY, updated.email);
      } else {
        users.push(updated);
        localStorage.setItem(LOGGED_KEY, updated.email);
      }
  
      setUsers(users);
      setLoggedEmail(updated.email);
    
      // sync to the fans list so leaderboard/stats show the full name
      if (typeof syncProfileToFans === 'function') syncProfileToFans(updated);
    
    }
  
    function deleteProfile() {
      if (!confirm('Delete your profile? This cannot be undone.')) return;
      const email = getLoggedEmail();
      if (!email) { alert('No logged-in user.'); return; }
      let users = getUsers().filter(u => u.email !== email);
      setUsers(users);
      localStorage.removeItem(LOGGED_KEY);
      // redirect to login (adjust path if different)
      window.location.href = 'index.html';
    }
  
    function cancelEdit(e) {
      e && e.preventDefault();
      populateForm(findCurrentUser());
    }
  
    // event wiring
    editBtn.addEventListener('click', () => setDisabled(false));
    saveBtn.addEventListener('click', saveProfile);
    cancelBtn.addEventListener('click', cancelEdit);
    deleteBtn.addEventListener('click', deleteProfile);
  
    // React to changes from other tabs/windows
    window.addEventListener('storage', function (e) {
      if (e.key === USERS_KEY || e.key === UPDATED_MARKER) {
        populateForm(findCurrentUser());
      }
    });
    // React to same-window updates
    window.addEventListener('profilesUpdated', function () {
      populateForm(findCurrentUser());
    });
  
    // init
    populateForm(findCurrentUser());
  })();
// ...existing code...
function getLoggedEmail() { return localStorage.getItem(LOGGED_KEY); }
   function setLoggedEmail(email) {
     if (email) localStorage.setItem(LOGGED_KEY, email);
     else localStorage.removeItem(LOGGED_KEY);
     // mark update so listeners refresh
     localStorage.setItem(UPDATED_MARKER, Date.now().toString());
    window.dispatchEvent(new Event('profilesUpdated'));
   }
  
    function findCurrentUser() {
      const email = getLoggedEmail();
      if (!email) return null;
      return getUsers().find(u => u.email === email) || null;
    }
 // ...existing code...
 
