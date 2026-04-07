import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';

type AISectionTitleProps = {
  title: string;
  className?: string;
};

export function AISectionTitle({ title, className }: AISectionTitleProps) {
  return (
    <VietnamText className={cn('text-[20px] font-bold leading-6 text-[#08090A]', className)}>
      {title}
    </VietnamText>
  );
}
