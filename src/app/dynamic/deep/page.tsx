import ExtraContextInfo from '@/app/components/ExtraContextInfo';
import { getNextContext } from '@/next-compose-middlewares';
import { createPage } from '@/middlewares';

import Link from 'next/link';
import path from 'path';

export default createPage(function Deep() {
  const { req } = getNextContext();
  return (
    <div>
      <ExtraContextInfo />
      <Link href={path.join(req.path, '..')}>up</Link>
    </div>
  );
});
