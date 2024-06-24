import { createNextContext } from '@/next-compose-middlewares';

export type ExtraContext = {
  from: string;
};

export const [getExtraContext, runInExtraContext] =
  createNextContext<ExtraContext>({
    from: 'default extra context',
  });
