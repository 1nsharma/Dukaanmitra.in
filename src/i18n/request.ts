import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  console.log('getRequestConfig processing locale:', locale);
  // Validate that the incoming `locale` parameter is valid
  if (locale && !routing.locales.includes(locale as any)) {
    console.log('Invalid locale:', locale);
    notFound();
  }

  return {
    locale: locale || routing.defaultLocale,
    messages: (await import(`../../messages/${locale || routing.defaultLocale}.json`)).default
  };
});
