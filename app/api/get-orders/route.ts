import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ВНИМАНИЕ: тебе нужно создать Web App в Google Apps Script 
    // с доступом для всех (как мы делали в Шаге 1)
    const response = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL!);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}