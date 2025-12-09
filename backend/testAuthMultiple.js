// testAuthMultiple.js - register and login for multiple registration types
// Run with: node testAuthMultiple.js

const tests = [
  {
    type: 'GRAM_PANCHAYAT',
    extra: { panchayatId: 'P001', gramPanchayatName: 'GP Test' }
  },
  {
    type: 'NGO',
    extra: { organizationName: 'Helping Hands', registrationNumber: 'NGO123' }
  },
  {
    type: 'SCHOOL_PTA',
    extra: { institutionName: 'Sunrise School', institutionType: 'Primary' }
  }
];

(async () => {
  const base = 'http://localhost:5000';
  for (const t of tests) {
    const unique = Date.now() + Math.floor(Math.random()*1000);
    const email = `tm${unique}@example.com`;
    const password = 'MultiTest123!';
    const payload = {
      registrationType: t.type,
      name: `${t.type} Tester ${unique}`,
      email,
      password,
      phoneNumber: '9999999999',
      district: 'D',
      state: 'S',
      address: 'Addr',
      ...t.extra
    };

    console.log('\n--- Testing', t.type, '---');
    console.log('Registering', email);
    let res = await fetch(`${base}/api/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    let body = await res.text();
    try { body = JSON.parse(body); } catch(e) {}
    console.log('Register status', res.status, body);
    if (res.status !== 201) { console.error('Registration failed for', t.type); continue; }

    // login with matching type
    const loginPayload = { userType: t.type, email, password };
    res = await fetch(`${base}/api/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(loginPayload) });
    body = await res.text(); try { body = JSON.parse(body); } catch(e) {}
    console.log('Login (matching) status', res.status, body);

    // login with wrong type (use NGO when actual is something else)
    const wrongType = (t.type === 'NGO') ? 'SCHOOL_PTA' : 'NGO';
    const wrongPayload = { userType: wrongType, email, password };
    res = await fetch(`${base}/api/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(wrongPayload) });
    body = await res.text(); try { body = JSON.parse(body); } catch(e) {}
    console.log('Login (wrong type) status', res.status, body);
  }
})();
