import { createPage } from 'next-compose-middlewares';
import Link from 'next/link';
import path from 'path';

export default createPage([
  function Deep({ res, req }) {
    res.render(<Link href={path.join(req.path, '..')}>up</Link>);
  },
]);
