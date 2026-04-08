import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectWhatsapp1() {
  const { phone, whatsappText } = await getPhoneNumber();
  const url = waLink(phone, whatsappText);
  return <RedirectClient url={url} />;
}
