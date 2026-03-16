import { type ButtonProps } from '@/components/ui/button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

type ShinyButtonProps = Omit<ButtonProps, 'children'> & {
  label?: string;
  children?: React.ReactNode;
};

export function ShinyButton({ className, children, label, variant, ...props }: ShinyButtonProps) {
  // progress goes 0 → 1 on repeat; sweep happens in first 30%, rest is pause
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-100, 400]);
    return { transform: [{ translateX }, { skewX: '-20deg' }] };
  });

  return (
    <Pressable
      role="button"
      className={cn(
        'w-full flex-row items-center justify-center overflow-hidden rounded-full border border-primary shadow-md shadow-black/10',
        variant === 'outline' ? 'bg-background' : 'bg-primary',
        className
      )}
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

      {/* Shiny sweep */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 80,
          },
          shimmerStyle,
        ]}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.25)',
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
