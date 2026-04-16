let fans = JSON.parse(localStorage.getItem("fans")) || [];


document.getElementById("loginForm")?.addEventListener("submit", login);

function login(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  if (!name) return;

  // fans is already read at top of script.js, but re-read to be safe
  const fansList = JSON.parse(localStorage.getItem("fans") || "[]");
  const exists = fansList.find(f => f.name === name);

  // set session token so we can identify the logged-in user across pages
  localStorage.setItem("currentFan", name);

  // if exists -> go to their dashboard; if not -> go to Register (you already have register.html)
  if (exists) window.location.href = "register.html"; // or a dashboard page
  else window.location.href = "register.html";
}


function requireLogin(redirectTo = 'index.html') {
  const logged = localStorage.getItem('currentFan') || localStorage.getItem('loggedInUserEmail');
  if (!logged) {
    alert('Please log in or register first.');
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
function syncProfileToFans(profile) {
  // ensure fans array exists
  const fans = JSON.parse(localStorage.getItem('fans') || '[]');

  const name = (profile.fullName || profile.fullname || profile.name || '').trim();
  if (!name) return; // nothing to sync

  // try to find an existing fan by name (you can change matching key if you prefer email)
  let fan = fans.find(f => f.name === name);

  if (!fan) {
    fan = {
      name,
      player: profile.favoritePlayer || profile.player || 'N/A',
      competition: profile.competition || profile.comp || 'N/A',
      since: parseInt(profile.since) || (new Date()).getFullYear()
    };
    fans.push(fan);
  } else {
    // update non-empty fields from profile
    fan.player = profile.favoritePlayer || profile.player || fan.player;
    fan.competition = profile.competition || profile.comp || fan.competition;
    fan.since = parseInt(profile.since) || fan.since;
  }

  localStorage.setItem('fans', JSON.stringify(fans));
}

function logout() {
 
  localStorage.removeItem("currentFan");           
  localStorage.removeItem("loggedInUserEmail");     
  alert("Logged out.");
  window.location.href = "index.html";
}


function showUser() {
  const user = localStorage.getItem("currentFan");
  if (user && document.getElementById("welcome")) {
    document.getElementById("welcome").textContent =
      "Welcome, " + user + "!";
  }
}


document.getElementById("fanForm")?.addEventListener("submit", saveFan);

function saveFan(e) {
  e.preventDefault();

  const currentFan = localStorage.getItem("currentFan");

  const exists = fans.some(fan => fan.name === currentFan);
  if (exists) {
    alert("You are already registered.");
    return;
  }

  const fan = {
    name: currentFan,
    player: document.getElementById("player").value,
    competition: document.querySelector('input[name="comp"]:checked').value,
    since: parseInt(document.getElementById("since").value)
  };

  fans.push(fan);
  localStorage.setItem("fans", JSON.stringify(fans));

  alert("Registration successful!");
}


function mostCommon(key) {
  const count = {};
  fans.forEach(f => count[f[key]] = (count[f[key]] || 0) + 1);

  let max = 0, result = "N/A";
  for (let item in count) {
    if (count[item] > max) {
      max = count[item];
      result = item;
    }
  }
  return result;
}

function checkRegistration() {
  const currentFan = localStorage.getItem("currentFan");
  const isRegistered = fans.some(fan => fan.name === currentFan);


  if (!isRegistered && location.pathname.includes("stats.html")) {
    alert("Please register first.");
    window.location.href = "register.html";
  }


  if (!isRegistered && location.pathname.includes("leaderboard.html")) {
    alert("Please register first.");
    window.location.href = "register.html";
  }

  
  if (!isRegistered) {
    disableLink("nav-stats");
    disableLink("nav-leaderboard");
  }
}

function disableLink(id) {
  const link = document.getElementById(id);
  if (link) {
    link.style.pointerEvents = "none";
    link.style.opacity = "0.4";
  }
}

function refreshStats() {
  // existing logic that reads localStorage 'users' and renders stats
}
// Listen for profile changes (other tabs + same tab)
window.addEventListener('storage', function (e) {
  if (e.key === 'users' || e.key === 'profileLastUpdated') {
    if (typeof refreshStats === 'function') refreshStats();
  }
});
window.addEventListener('profilesUpdated', function () {
  if (typeof refreshStats === 'function') refreshStats();
});

function refreshLeaderboard() {
  // existing logic to build leaderboard from localStorage 'users'
}
window.addEventListener('storage', function (e) {
  if (e.key === 'users' || e.key === 'profileLastUpdated') {
    if (typeof refreshLeaderboard === 'function') refreshLeaderboard();
  }
});
window.addEventListener('profilesUpdated', function () {
  if (typeof refreshLeaderboard === 'function') refreshLeaderboard();
});

(function () {
  const USERS_KEY = 'users';
  const LOGGED_KEY = 'loggedInUserEmail';
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
    window.dispatchEvent(new Event('profilesUpdated'));
  }
  function getLoggedEmail() { return localStorage.getItem(LOGGED_KEY); }
  function setLoggedEmail(email) { if (email) localStorage.setItem(LOGGED_KEY, email); else localStorage.removeItem(LOGGED_KEY); }

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

  console.groupCollapsed('saveProfile debug');
  try {
    const emailInput = form.querySelector('input[name="email"]');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    console.log('email input element exists?', !!emailInput, 'emailVal:', emailVal);

    if (!emailInput || !emailVal) {
      alert('Email is required.');
      console.error('saveProfile aborted: missing email input or value.');
      console.groupEnd();
      return;
    }

    const users = getUsers();
    console.log('users before save:', users);

    const loggedEmail = getLoggedEmail();
    console.log('loggedEmail (current):', loggedEmail);

    const index = users.findIndex(u => u.email === loggedEmail);
    console.log('found user index for loggedEmail:', index);

    const updated = {};
    inputs.forEach(i => { if (i.name) updated[i.name] = i.value; });
    // ensure email field is set
    if (!updated.email) updated.email = emailVal;

    console.log('updated object to save:', updated);

    if (index >= 0) {
      // update existing user
      users[index] = Object.assign({}, users[index], updated);
      console.log('updated existing user at index', index);
    } else {
      // add new user
      users.push(updated);
      console.log('added new user');
    }

    // Persist users first
    setUsers(users);

    // mark as logged in using the email entered (always set)
    setLoggedEmail(updated.email);
    console.log('set logged email to:', updated.email);

    setDisabled(true);
    alert('Profile saved and you are now logged in.');
    console.log('users after save:', getUsers());
  } catch (err) {
    console.error('saveProfile error:', err);
    alert('An error occurred saving the profile. Check console.');
  } finally {
    console.groupEnd();
  }
}
// ...existing code...

// filepath: /c:/Users/STRONTIUM/Project-6/script.js
// ...existing code...
// Add quick runtime sanity checks after IIFE init (append near end of file)
(function debugInit() {
  // quick DOM checks
  if (!form) console.error('profile form not found (id="profile-form").');
  if (!editBtn) console.error('edit button not found (id="edit-profile").');
  if (!saveBtn) console.error('save button not found (id="save-profile").');
  if (!deleteBtn) console.error('delete button not found (id="delete-profile").');

  // show current localStorage keys we're using
  console.log('localStorage snapshot:', {
    users: localStorage.getItem('users'),
    loggedInUserEmail: localStorage.getItem('loggedInUserEmail'),
    profileLastUpdated: localStorage.getItem('profileLastUpdated')
  });
})();

  function deleteProfile() {
    if (!confirm('Delete your profile? This cannot be undone.')) return;
    const email = getLoggedEmail();
    if (!email) { alert('No logged-in user.'); return; }
    const users = getUsers().filter(u => u.email !== email);
    setUsers(users);
    setLoggedEmail(null);
    alert('Profile deleted.');
    // redirect to login or registration
    window.location.href = 'register.html';
  }

  function cancelEdit(e) {
    e && e.preventDefault();
    populateForm(findCurrentUser());
  }

  // wire events
  editBtn.addEventListener('click', () => setDisabled(false));
  saveBtn.addEventListener('click', saveProfile);
  cancelBtn.addEventListener('click', cancelEdit);
  deleteBtn.addEventListener('click', deleteProfile);

  // react to storage changes (other tabs)
  window.addEventListener('storage', function (e) {
    if (e.key === USERS_KEY || e.key === UPDATED_MARKER) {
      populateForm(findCurrentUser());
    }
  });
  // same-window update
  window.addEventListener('profilesUpdated', function () { populateForm(findCurrentUser()); });

  // init: if logged in populate, otherwise keep form disabled and show hint
  const current = findCurrentUser();
  if (current) populateForm(current);
  else {
    populateForm(null);
    // If registration occurs elsewhere, saving there should set LOGGED_KEY
    // Show the edit button only after login; keep save hidden until Edit clicked
    editBtn.style.display = 'inline-block';
    setDisabled(true);
  }})();
  function syncProfileToFans(profile) {
    const fans = JSON.parse(localStorage.getItem('fans') || '[]');
    const name = (profile.fullName || profile.fullname || profile.name || '').trim();
    if (!name) return;
    let fan = fans.find(f => f.name === name);
    if (!fan) {
      fan = {
        name,
        player: profile.favoritePlayer || profile.player || 'N/A',
        competition: profile.competition || profile.comp || 'N/A',
        since: parseInt(profile.since) || (new Date()).getFullYear()
      };
      fans.push(fan);
    } else {
      fan.player = profile.favoritePlayer || profile.player || fan.player;
      fan.competition = profile.competition || profile.comp || fan.competition;
      fan.since = parseInt(profile.since) || fan.since;
    }
    localStorage.setItem('fans', JSON.stringify(fans));
  }
