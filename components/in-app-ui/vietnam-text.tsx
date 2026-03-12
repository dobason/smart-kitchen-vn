import * as React from 'react';
import { Text } from '@/components/ui/text';

function VietnamText({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Text> &
  React.RefAttributes<Text> & {
    asChild?: boolean;
  }) {
  return (
    <Text style={{ fontFamily: 'BeVietnamPro_400Regular' }} className={className} {...props} />
  );
}

export { VietnamText };
