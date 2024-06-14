import ExtraContextInfo from '@/app/components/ExtraContextInfo';
import { createPage, getNextContext } from 'next-compose-middlewares';
import Link from 'next/link';
import path from 'path';

export default createPage([], function Deep(...args) {
  console.log('Deep', args);
  const { res, req } = getNextContext();
  res.render(
    <div>
      <ExtraContextInfo />
      <Link href={path.join(req.path, '..')}>up</Link>
    </div>,
  );
});
