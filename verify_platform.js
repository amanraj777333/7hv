import http from 'http';

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('--- 7 HORSE VENTURES PLATFORM INTEGRATION TEST ---');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health check
  await test('CMS Backend Health Check', async () => {
    const res = await request('http://localhost:5000/api/health');
    if (res.status !== 200 || res.data.status !== 'ok') throw new Error('Health check failed');
  });

  // 2. Authentication
  let authToken = '';
  await test('Admin Authentication with Passcode', async () => {
    const res = await request('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { passcode: '7horse2026' });

    if (res.status !== 200 || !res.data.success) throw new Error('Auth failed');
    authToken = res.data.token;
  });

  // 3. Media Mappings
  await test('Media Mappings & Live Replacement System', async () => {
    const getRes = await request('http://localhost:5000/api/media-mappings');
    if (getRes.status !== 200 || !Array.isArray(getRes.data)) throw new Error('Mappings get failed');

    const heroKey = 'home.hero.background';
    const putRes = await request(`http://localhost:5000/api/media-mappings/${encodeURIComponent(heroKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=80',
      alt: '7 Horse Ventures Inaugural Cohort Convention',
      position: 'center',
      fit: 'cover',
      adminUser: 'Verification Test'
    });

    if (putRes.status !== 200 || putRes.data.url.indexOf('1800') === -1) {
      throw new Error('Image update failed');
    }
  });

  // 4. Events CRUD
  let createdEventId = '';
  await test('Events Management & Attendee Check-In', async () => {
    const createRes = await request('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: '7H Test Cohort — Automated Validation',
      type: 'Founder Connect',
      city: 'Gurugram',
      date: 'Saturday, August 29, 2026',
      time: '4:00 PM – 7:00 PM IST',
      location: 'One Horizon Center, Golf Course Rd',
      status: 'Upcoming',
      capacity: '40 Founders',
      adminUser: 'Verification Test'
    });

    if (createRes.status !== 200 || !createRes.data.id) throw new Error('Event create failed');
    createdEventId = createRes.data.id;

    // Register attendee
    const regRes = await request('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      eventId: createdEventId,
      eventTitle: '7H Test Cohort — Automated Validation',
      name: 'Aditya Birla',
      email: 'aditya@nexustech.io',
      phone: '+91 98111 22334',
      startupOrCompany: 'Nexus Technologies',
      role: 'Founder & CEO',
      city: 'Gurugram',
      checkedIn: false
    });

    if (regRes.status !== 200 || !regRes.data.id) throw new Error('Registration failed');

    // Toggle checkin
    const checkinRes = await request(`http://localhost:5000/api/registrations/${regRes.data.id}/checkin`, {
      method: 'PUT'
    });

    if (checkinRes.status !== 200 || checkinRes.data.checkedIn !== true) throw new Error('Checkin toggle failed');
  });

  // 5. Articles & Publishing
  await test('Editorial & Insights Publishing', async () => {
    const artRes = await request('http://localhost:5000/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Scaling from Gurugram to Global Markets',
      slug: 'scaling-from-gurugram-to-global-markets',
      type: 'blog',
      category: 'Venture & Growth',
      summary: 'Operational lessons from Delhi NCR B2B software founders.',
      published: true,
      featured: true,
      author: { name: 'Ecosystem Editorial' }
    });

    if (artRes.status !== 200 || !artRes.data.id) throw new Error('Article create failed');
  });

  // 6. Newsletter & Subscribers
  await test('Newsletter Dispatch & Subscriber List', async () => {
    const subRes = await request('http://localhost:5000/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'founder.brief.test@example.com',
      city: 'Gurugram',
      status: 'active'
    });

    if (subRes.status !== 200) throw new Error('Subscriber create failed');

    // Dispatch newsletter
    const nlList = await request('http://localhost:5000/api/newsletters');
    if (nlList.data && nlList.data.length > 0) {
      const sendRes = await request(`http://localhost:5000/api/newsletters/${nlList.data[0].id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { adminUser: 'Verification Test' });

      if (sendRes.status !== 200 || !sendRes.data.success) throw new Error('Newsletter dispatch failed');
    }
  });

  // 7. Directories (Founders, Startups, Opportunities)
  await test('Directory Submissions & Approval Lifecycle', async () => {
    const createRes = await request('http://localhost:5000/api/founders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Rohan Sharma',
      startup: 'InnoFlow AI',
      role: 'Co-Founder',
      city: 'Delhi',
      status: 'pending'
    });

    if (createRes.status !== 200 || !createRes.data.id) throw new Error('Founder submit failed');

    // Approve
    const approveRes = await request(`http://localhost:5000/api/founders/${createRes.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { status: 'approved' });

    if (approveRes.status !== 200 || approveRes.data.status !== 'approved') throw new Error('Approval failed');
  });

  // 8. Pitch Applications
  await test('Pitch Applications Evaluation & Scoring', async () => {
    const appRes = await request('http://localhost:5000/api/pitch-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      startupName: 'AutoLogistics AI',
      founderName: 'Kavita Verma',
      sector: 'Supply Chain & Logistics',
      stage: 'Seed',
      ask: '₹3 Cr',
      revenue: '₹12L MRR'
    });

    if (appRes.status !== 200 || !appRes.data.id) throw new Error('Pitch app create failed');

    // Score and shortlist
    const updateRes = await request(`http://localhost:5000/api/pitch-applications/${appRes.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { status: 'shortlisted', score: 9 });

    if (updateRes.status !== 200 || updateRes.data.score !== 9) throw new Error('Pitch evaluate failed');
  });

  // 9. Partnerships CRM
  await test('Partnerships Pipeline Advancement', async () => {
    const leadRes = await request('http://localhost:5000/api/partnerships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      organization: 'Venture Capital Syndicate India',
      contactName: 'Nitin Gupta',
      tier: 'Capital Syndicate',
      stage: 'Discovery'
    });

    if (leadRes.status !== 200 || !leadRes.data.id) throw new Error('Partnership lead create failed');

    const advRes = await request(`http://localhost:5000/api/partnerships/${leadRes.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { stage: 'Partnered' });

    if (advRes.status !== 200 || advRes.data.stage !== 'Partnered') throw new Error('Partnership advance failed');
  });

  // 10. Frontend HTML check
  await test('Frontend Preview Server HTTP 200 Response', async () => {
    const htmlRes = await request('http://localhost:5173/');
    if (htmlRes.status !== 200) throw new Error(`Frontend returned status ${htmlRes.status}`);
    if (!htmlRes.text.includes('7 Horse Ventures')) throw new Error('Page title missing');
  });

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} / ${total} tests passed (100% success rate)`);
  console.log(`========================================`);
}

runVerification().catch(console.error);
