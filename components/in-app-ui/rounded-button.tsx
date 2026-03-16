import { Button, type ButtonProps } from '@/components/ui/button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';

type RoundedButtonProps = ButtonProps & {
  label?: string;
};

export function RoundedButton({
  label,
  children,
  className,
  variant,
  ...props
}: RoundedButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn('rounded-full border-primary px-8 shadow-md shadow-black/10', className)}
      {...props}>
      {label ? (
        <VietnamText
          className={cn(
            'font-semibold text-primary-foreground',
            variant === 'outline' && 'text-primary'
          )}>
          {label}
        </VietnamText>
      ) : (
        children
      )}
    </Button>
  );
}
