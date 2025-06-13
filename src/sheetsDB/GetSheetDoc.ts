import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export async function GetSheetDoc(): Promise<GoogleSpreadsheet> {
  const sheetAuth = new JWT({
    email: process.env.GOOGLE_SA_EMAIL!,
    key: process.env.GOOGLE_SA_KEY!.split(String.raw`\n`).join("\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(process.env.SHEET_DB_ID!, sheetAuth);

  await doc.loadInfo();
  return doc;
}
