import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CircleButtonProps = ButtonProps;

export function CircleButton({ children, className, variant, ...props }: CircleButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        'inline-flex items-center justify-center rounded-full shadow-md shadow-black/10',
        className
      )}
      {...props}>
      {children}
    </Button>
  );
}
