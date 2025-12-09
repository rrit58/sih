// testAuth.js - quick register -> login smoke test
// Run with: node testAuth.js

(async () => {
  try {
    const base = 'http://localhost:5000';
    const unique = Date.now();
    const password = 'TestPass123!';
    const registrationType = 'GRAM_PANCHAYAT';
    const payload = {
      registrationType,
      name: 'Test User ' + unique,
      email: `test${unique}@example.com`,
      password,
      phoneNumber: '9999999999',
      district: 'TestDistrict',
      state: 'TestState',
      address: '123 Test Lane'
    };

    console.log('\n➡️  Registering user:', payload.email, 'type=', registrationType);
    const regRes = await fetch(`${base}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const regText = await regRes.text();
    let regJson = null;
    try { regJson = JSON.parse(regText); } catch(e) { regJson = regText; }
    console.log('Register status:', regRes.status);
    console.log('Register response:', regJson);

    if (regRes.status !== 201) {
      console.error('\n❌ Registration failed — aborting login test');
      process.exit(regRes.status || 1);
    }

    // Now attempt login
    const loginPayload = {
      userType: registrationType,
      email: payload.email,
      password: password,
    };

    console.log('\n➡️  Logging in user:', loginPayload.email);
    const loginRes = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload),
    });

    const loginText = await loginRes.text();
    let loginJson = null;
    try { loginJson = JSON.parse(loginText); } catch(e) { loginJson = loginText; }

    console.log('Login status:', loginRes.status);
    console.log('Login response:', loginJson);

    if (loginRes.status === 200) {
      console.log('\n✅ Register -> Login flow succeeded');
      process.exit(0);
    } else {
      console.error('\n❌ Login failed');
      process.exit(loginRes.status || 1);
    }
  } catch (err) {
    console.error('Error running test:', err);
    process.exit(1);
  }
})();
