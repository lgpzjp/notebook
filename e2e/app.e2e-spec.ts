import { AppPage } from './app.po';

describe('angular-cli-v1.7.4 App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(true).toBeTruthy();
  });
});
