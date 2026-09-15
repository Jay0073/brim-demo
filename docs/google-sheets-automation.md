# Website form → Google Sheets automation

The website uses the Apps Script in `apps-script/Code.gs` to write each form submission to this spreadsheet:

`1lHfxqfODnGTQDF4FJYRgXtEQWWnNnI9I3RWmpdigp8s`

## One-time Google setup

1. Open [Google Apps Script](https://script.google.com/), create a project and replace the default file contents with `apps-script/Code.gs`.
2. Run `setup` once, approve the Google permissions, and confirm the `Franchisee` and `Contact Us` tabs were created.
3. Deploy → New deployment → Web app.
4. Set **Execute as** to your Google account and **Who has access** to **Anyone**. Copy the `/exec` deployment URL.
5. Add the URL as the `NEXT_PUBLIC_FORM_AUTOMATION_URL` repository secret in GitHub, then update `.github/workflows/deploy.yml` so the build receives it:

```yml
env:
  GITHUB_PAGES: "true"
  NEXT_PUBLIC_FORM_AUTOMATION_URL: ${{ secrets.NEXT_PUBLIC_FORM_AUTOMATION_URL }}
```

6. Redeploy the site and submit one test enquiry to each form.

The client sends a plain-text JSON request with `no-cors`; this avoids browser cross-origin restrictions for Apps Script web apps. The Apps Script validates required values, serialises concurrent writes with a script lock and appends a UTC timestamp and `New` status to the correct tab.
