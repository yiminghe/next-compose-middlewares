import { createNextContext } from '@/next-compose-middlewares';

export type ExtraContext = {
  from: string;
};

export const [getExtraContext, setExtraContext] =
  createNextContext<ExtraContext>({
    from: 'default extra context',
  });
