export const syncToGoogleSheets = async (url: string, sheetName: string, data: any) => {
  if (!url) return;
  try {
    // We send as text/plain to avoid preflight OPTIONS requests,
    // which simplifies the Google Apps Script side significantly.
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ sheetName, data }),
    });
  } catch (error) {
    console.error(`Failed to sync ${sheetName} to Google Sheets:`, error);
  }
};
