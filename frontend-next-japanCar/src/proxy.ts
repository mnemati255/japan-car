import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'ja'];

function getLocale() {
  const negotiatorHeader = { 'accept-language': 'en-US,en;q=0.5' };
  const languages = new Negotiator({ headers: negotiatorHeader }).languages();

  const defaultLocale = 'en';
  const locale = match(languages, locales, defaultLocale);

  return locale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes('panel') || pathname.includes('login')) return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // اگر زبان در URL موجود بود، مسیر را ادامه بده
  if (pathnameHasLocale) return;

  // دریافت زبان از هدر درخواست
  const locale = getLocale();

  // تغییر مسیر به زبان صحیح
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|svg|images|videos|css|js|fonts|.*\\.svg).*)',
  ],
};
