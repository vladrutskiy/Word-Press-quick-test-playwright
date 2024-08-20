import { test, expect, Page } from '@playwright/test';
import HomePage from '../pages/home-page';
import TopMenuPage from '../pages/top-menu-page';


//AAA stands for Arrange - Act - Assert
// POM is a Page Object  Model

const URL = 'https://playwright.dev/';
let homePage: HomePage;
let topMenuPage: TopMenuPage;
const pageURL = /.*intro/; 
test.beforeEach (async({page}) =>{
    await page.goto(URL);
    homePage = new HomePage(page);
});

async function clickGetStarted(page:Page) {
   // await page.getByRole('link', {name: 'Get started'}).click();
    await homePage.clickGetStarted ();
}

test.describe('Playwright website', () => {
    test('has title', async ({ page }) => {
     
    // Expect a title "to contain" a substring.
    //await expect(page).toHaveTitle(/Playwright/);
    await homePage.assertPageTitle();
  });
  
  test('get started link', async ({ page }) => {
      
    // Click the get started link.
    await clickGetStarted(page);
  
    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*intro/);
  });
  
  test('check Java page', async ({ page }) => {
    await clickGetStarted;
    await page.getByRole('button', {name: 'Node.js'}).hover();
    await page.getByText('Java', {exact: true}).click();
    await expect(page).toHaveURL('https://playwright.dev/java/docs/intro');
    // expect a text is not displayed.
    await expect (page.getByText('Installing Playwright', {exact: true})).not.toBeVisible();
  const javaDescription = `Playwright is distributed as a set`;
  await expect(page.getByText(javaDescription)).toBeVisible();
  
  
  })

})


  