import { cn } from '@/lib/utils';
import { Pressable, type PressableProps } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as React from 'react';

type TagProps = PressableProps & {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
};

export function Tag({ label, active = false, icon, className, ...props }: TagProps) {
  return (
    <Pressable
      role="button"
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border px-3.5 py-2',
        active ? 'border-primary bg-primary/10' : 'border-border bg-background',
        className
      )}
      {...props}>
      {icon}
      <VietnamText className={cn('text-sm font-medium', 'text-foreground')}>{label}</VietnamText>
    </Pressable>
  );
}
