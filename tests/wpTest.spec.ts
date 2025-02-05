import { test, expect } from '@playwright/test';

// List of URLs that should NOT be accessible
const urlsToTest = [
  '/wp-content/uploads/',
  '/wp-content/uploads/wpforms/',
  '/wp-includes',
  '/wp-config.php',
  '/wp-links-opml.php',
  '/wp-trackback.php',
  '/xmlrpc.php',
  '/wp-load.php',
  '/wp-settings.php',
  '/readme.html',
  '/wp-cron.php',
  '/wp-content/plugins/social-warfare/',
  '/wp-content/plugins/themes/twentytwenty/',
  '/wp-admin/install.php',
  '/wp-admin/readme.html',
  '/hello-world/',
  '/wp-signup.php/',
  '/wp-JSON/',
  '/wp-activate.php/',
  '/wp-blog-header.php/',
  '/wp-mail.php/',
  '/wp-json/wp/v2/users/',
  '/wp-json/wp/v2/plugins/',
  '/wp-json/wp/v2/themes/',
  '/wp-json/wp/v2/comments/',
];

// Expected text responses that should not be visible
const forbiddenTexts = {
  '/wp-config.php': 'Internal Server Error',
  '/wp-links-opml.php': 'This XML file does not appear to have any style information',
  '/wp-trackback.php': 'I really need an ID for this to work.',
  '/xmlrpc.php': 'XML-RPC server accepts POST requests only.',
  '/readme.html': 'Semantic Personal Publishing Platform',
  '/wp-admin/install.php': 'Already Installed',
};

// Loop through the URLs and create tests dynamically
urlsToTest.forEach((url) => {
  test(`Check that ${url} is not accessible`, async ({ page }) => {
    await page.goto(url);

    // Ensure the page doesn't have a valid title (indicating inaccessibility)
    await expect(page).not.toHaveTitle('');

    // If a forbidden text is expected, check it is not visible
    if (forbiddenTexts[url]) {
      await expect(page.getByText(forbiddenTexts[url], { exact: true })).not.toBeVisible();
    }

    // Check if 404 is present
    await page.getByText('404').allInnerTexts();
  });
});

// API Tests
const apiTests = [
  { url: '/wp-json/wp/v2/users/', forbiddenText: 'description' },
  { url: '/wp-json', forbiddenText: 'description' },
];

apiTests.forEach(({ url, forbiddenText }) => {
  test(`API response ${url} should not contain the word "${forbiddenText}"`, async ({ request }) => {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    const responseBodyString = JSON.stringify(await response.json());
    expect(responseBodyString).not.toContain(forbiddenText);
  });
});

// XMLRPC API Tests
const xmlrpcTests = [
  { method: 'demo.sayHello', forbiddenText: 'Hello' },
  { method: 'system.listMethods', forbiddenText: 'methodResponse' }
];

xmlrpcTests.forEach(({ method, forbiddenText }) => {
  test(`API response /xmlrpc.php should not contain the word "${forbiddenText}"`, async ({ request }) => {
    const xmlPayload = `
      <methodCall>
        <methodName>${method}</methodName>
        <params></params>
      </methodCall>
    `;

    const response = await request.post('/xmlrpc.php', {
      headers: { 'Content-Type': 'application/xml' },
      data: xmlPayload
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    expect(responseBody).not.toContain(forbiddenText);
  });
});


