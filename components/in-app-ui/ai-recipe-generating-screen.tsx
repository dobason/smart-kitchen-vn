import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_RED = '#CE232A';
const SCREEN_BG = '#FCE9EC';
const GENERATING_DURATION_MS = 20000;
const ACTION_CYCLE_MS = 6200;

function instantReset(value: Animated.Value) {
  return Animated.timing(value, {
    toValue: 0,
    duration: 1,
    useNativeDriver: true,
  });
}

export default function AIRecipeGeneratingScreen() {
  const { t } = useLocale();
  const router = useRouter();

  const [showDoneModal, setShowDoneModal] = React.useState(false);

  const actionCycle = React.useRef(new Animated.Value(0)).current;
  const steamCycle = React.useRef(new Animated.Value(0)).current;
  const durationProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const actionLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(actionCycle, {
          toValue: 1,
          duration: ACTION_CYCLE_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        instantReset(actionCycle),
        Animated.delay(220),
      ])
    );

    const steamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(steamCycle, {
          toValue: 1,
          duration: 1350,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        instantReset(steamCycle),
      ])
    );

    actionLoop.start();
    steamLoop.start();

    return () => {
      actionLoop.stop();
      steamLoop.stop();
    };
  }, [actionCycle, steamCycle]);

  React.useEffect(() => {
    const progressAnimation = Animated.timing(durationProgress, {
      toValue: 1,
      duration: GENERATING_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    progressAnimation.start();

    const doneTimeout = setTimeout(() => {
      setShowDoneModal(true);
    }, GENERATING_DURATION_MS);

    return () => {
      clearTimeout(doneTimeout);
      progressAnimation.stop();
    };
  }, [durationProgress]);

  const boardRotate = actionCycle.interpolate({
    inputRange: [0, 0.1, 0.2, 0.27, 1],
    outputRange: ['-8deg', '4deg', '16deg', '22deg', '22deg'],
  });

  const boardTranslateX = actionCycle.interpolate({
    inputRange: [0, 0.12, 0.24, 1],
    outputRange: [0, 16, 42, 42],
  });

  const boardTranslateY = actionCycle.interpolate({
    inputRange: [0, 0.12, 0.24, 1],
    outputRange: [0, 16, 34, 34],
  });

  const boardOpacity = actionCycle.interpolate({
    inputRange: [0, 0.22, 0.27, 1],
    outputRange: [1, 1, 0, 0],
  });

  const foodOneOpacity = actionCycle.interpolate({
    inputRange: [0, 0.06, 0.2, 0.25, 1],
    outputRange: [0, 1, 1, 0, 0],
  });

  const foodOneX = actionCycle.interpolate({
    inputRange: [0, 0.08, 0.24, 1],
    outputRange: [96, 110, 146, 146],
  });

  const foodOneY = actionCycle.interpolate({
    inputRange: [0, 0.08, 0.24, 1],
    outputRange: [94, 108, 188, 188],
  });

  const foodTwoOpacity = actionCycle.interpolate({
    inputRange: [0, 0.11, 0.24, 0.29, 1],
    outputRange: [0, 1, 1, 0, 0],
  });

  const foodTwoX = actionCycle.interpolate({
    inputRange: [0, 0.12, 0.26, 1],
    outputRange: [118, 126, 162, 162],
  });

  const foodTwoY = actionCycle.interpolate({
    inputRange: [0, 0.12, 0.26, 1],
    outputRange: [98, 116, 190, 190],
  });

  const bottleRotate = actionCycle.interpolate({
    inputRange: [0, 0.25, 0.31, 0.35, 0.41, 0.47, 1],
    outputRange: ['0deg', '0deg', '-6deg', '-44deg', '-44deg', '0deg', '0deg'],
  });

  const bottleTranslateY = actionCycle.interpolate({
    inputRange: [0, 0.25, 0.31, 0.35, 0.41, 0.47, 1],
    outputRange: [0, 0, -22, -34, -34, 0, 0],
  });

  const bottleTranslateX = actionCycle.interpolate({
    inputRange: [0, 0.25, 0.31, 0.35, 0.41, 0.47, 1],
    outputRange: [0, 0, -40, -86, -86, 0, 0],
  });

  const oilOpacity = actionCycle.interpolate({
    inputRange: [0, 0.34, 0.355, 0.41, 0.44, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const oilDropY = actionCycle.interpolate({
    inputRange: [0, 0.355, 0.44, 1],
    outputRange: [0, 0, 54, 54],
  });

  const oilDropX = actionCycle.interpolate({
    inputRange: [0, 0.31, 0.35, 0.41, 0.47, 1],
    outputRange: [0, -40, -86, -86, 0, 0],
  });

  const spiceOneRotate = actionCycle.interpolate({
    inputRange: [0, 0.46, 0.5, 0.58, 0.62, 1],
    outputRange: ['0deg', '0deg', '-8deg', '-40deg', '0deg', '0deg'],
  });

  const spiceOneTranslateY = actionCycle.interpolate({
    inputRange: [0, 0.46, 0.5, 0.58, 0.62, 1],
    outputRange: [0, 0, -56, -80, 0, 0],
  });

  const spiceOneTranslateX = actionCycle.interpolate({
    inputRange: [0, 0.46, 0.5, 0.58, 0.62, 1],
    outputRange: [0, 0, 64, 116, 0, 0],
  });

  const spiceTwoRotate = actionCycle.interpolate({
    inputRange: [0, 0.66, 0.7, 0.78, 0.82, 1],
    outputRange: ['0deg', '0deg', '-8deg', '-38deg', '0deg', '0deg'],
  });

  const spiceTwoTranslateY = actionCycle.interpolate({
    inputRange: [0, 0.66, 0.7, 0.78, 0.82, 1],
    outputRange: [0, 0, -52, -76, 0, 0],
  });

  const spiceTwoTranslateX = actionCycle.interpolate({
    inputRange: [0, 0.66, 0.7, 0.78, 0.82, 1],
    outputRange: [0, 0, 40, 76, 0, 0],
  });

  const spiceOneOpacity = actionCycle.interpolate({
    inputRange: [0, 0.5, 0.53, 0.58, 0.61, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const spiceTwoOpacity = actionCycle.interpolate({
    inputRange: [0, 0.7, 0.73, 0.79, 0.82, 1],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const spiceOneDropY = actionCycle.interpolate({
    inputRange: [0, 0.53, 0.61, 1],
    outputRange: [0, 0, 94, 94],
  });

  const spiceOneDropX = actionCycle.interpolate({
    inputRange: [0, 0.5, 0.54, 0.58, 0.62, 1],
    outputRange: [0, 64, 116, 116, 0, 0],
  });

  const spiceTwoDropY = actionCycle.interpolate({
    inputRange: [0, 0.73, 0.82, 1],
    outputRange: [0, 0, 90, 90],
  });

  const spiceTwoDropX = actionCycle.interpolate({
    inputRange: [0, 0.7, 0.74, 0.78, 0.82, 1],
    outputRange: [0, 40, 76, 76, 0, 0],
  });

  const oilDropLiftedY = Animated.add(oilDropY, bottleTranslateY);
  const spiceOneDropLiftedY = Animated.add(spiceOneDropY, spiceOneTranslateY);
  const spiceTwoDropLiftedY = Animated.add(spiceTwoDropY, spiceTwoTranslateY);

  const spoonRotate = actionCycle.interpolate({
    inputRange: [0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.27, 0.82, 0.86, 0.9, 0.94, 0.98, 1],
    outputRange: [
      '-16deg',
      '14deg',
      '-13deg',
      '12deg',
      '-11deg',
      '10deg',
      '-9deg',
      '-6deg',
      '-6deg',
      '12deg',
      '-14deg',
      '10deg',
      '-12deg',
      '-16deg',
    ],
  });

  const spoonTranslateY = actionCycle.interpolate({
    inputRange: [0, 0.24, 0.27, 0.82, 0.85, 1],
    outputRange: [0, 0, -42, -42, 0, 0],
  });

  const steamOpacity = steamCycle.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.72, 0],
  });

  const steamTranslateY = steamCycle.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -22],
  });

  const steamOpacityDelayed = steamCycle.interpolate({
    inputRange: [0, 0.18, 0.56, 1],
    outputRange: [0, 0, 0.76, 0],
  });

  const steamTranslateYDelayed = steamCycle.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -18],
  });

  const progressWidth = durationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 224],
  });

  const handleConfirm = React.useCallback(() => {
    setShowDoneModal(false);
    router.replace('/(tabs)');
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.scene}>
          <Animated.View
            style={[
              styles.boardContainer,
              {
                opacity: boardOpacity,
                transform: [{ translateX: boardTranslateX }, { translateY: boardTranslateY }, { rotate: boardRotate }],
              },
            ]}>
            <View style={styles.board} />
            <View style={styles.boardHandle} />
            <View style={styles.boardFood} />
          </Animated.View>

          <Animated.View
            style={[
              styles.foodPiece,
              styles.foodGreen,
              {
                opacity: foodOneOpacity,
                transform: [{ translateX: foodOneX }, { translateY: foodOneY }, { rotate: '20deg' }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.foodPiece,
              styles.foodOrange,
              {
                opacity: foodTwoOpacity,
                transform: [{ translateX: foodTwoX }, { translateY: foodTwoY }, { rotate: '-24deg' }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.spoonContainer,
              {
                transform: [{ translateY: spoonTranslateY }, { rotate: spoonRotate }],
              },
            ]}>
            <View style={styles.spoonHandle} />
            <View style={styles.spoonNeck} />
            <View style={styles.spoonHead} />
          </Animated.View>

          <Animated.View
            style={[
              styles.spiceJarContainerLeft,
              {
                transform: [
                  { translateX: spiceOneTranslateX },
                  { translateY: spiceOneTranslateY },
                  { rotate: spiceOneRotate },
                ],
              },
            ]}>
            <View style={styles.spiceCap} />
            <View style={styles.spiceBody} />
          </Animated.View>

          <Animated.View
            style={[
              styles.spiceJarContainerRight,
              {
                transform: [
                  { translateX: spiceTwoTranslateX },
                  { translateY: spiceTwoTranslateY },
                  { rotate: spiceTwoRotate },
                ],
              },
            ]}>
            <View style={styles.spiceCap} />
            <View style={[styles.spiceBody, styles.spiceBodyDark]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.spiceDropOne,
              {
                opacity: spiceOneOpacity,
                transform: [{ translateX: spiceOneDropX }, { translateY: spiceOneDropLiftedY }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.spiceDropTwo,
              {
                opacity: spiceTwoOpacity,
                transform: [{ translateX: spiceTwoDropX }, { translateY: spiceTwoDropLiftedY }],
              },
            ]}
          />

          <View style={styles.potLeftHandle} />
          <View style={styles.potRightHandle} />

          <View style={styles.potBody}>
            <View style={styles.potHighlight} />
            <View style={styles.potRim} />
          </View>

          <Animated.View
            style={[
              styles.steam,
              {
                left: 150,
                opacity: steamOpacity,
                transform: [{ translateY: steamTranslateY }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.steam,
              styles.steamTall,
              {
                left: 172,
                opacity: steamOpacityDelayed,
                transform: [{ translateY: steamTranslateYDelayed }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.bottleContainer,
              {
                transform: [{ translateX: bottleTranslateX }, { translateY: bottleTranslateY }, { rotate: bottleRotate }],
              },
            ]}>
            <View style={styles.bottleCap} />
            <View style={styles.bottleBody} />
            <View style={styles.bottleLabel} />
          </Animated.View>

          <Animated.View
            style={[
              styles.oilDrop,
              {
                opacity: oilOpacity,
                transform: [{ translateX: oilDropX }, { translateY: oilDropLiftedY }],
              },
            ]}
          />

          <View style={styles.stoveTop} />
          <View style={styles.stoveShadow} />
        </View>

        <View style={styles.statusBlock}>
          <VietnamText style={styles.statusText}>{t('aiRecipe.generatingStatus')}</VietnamText>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </View>
      </View>

      <Modal visible={showDoneModal} animationType="fade" transparent statusBarTranslucent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <VietnamText style={styles.modalTitle}>{t('aiRecipe.generatedDoneTitle')}</VietnamText>
            <VietnamText style={styles.modalDescription}>
              {t('aiRecipe.generatedDoneDescription')}
            </VietnamText>

            <Pressable onPress={handleConfirm} style={styles.modalButton}>
              <VietnamText style={styles.modalButtonText}>{t('aiRecipe.ok')}</VietnamText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 54,
  },
  scene: {
    width: 320,
    height: 280,
    position: 'relative',
  },
  boardContainer: {
    position: 'absolute',
    top: 46,
    left: 56,
    width: 90,
    height: 44,
    justifyContent: 'center',
  },
  board: {
    width: 78,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#E4B374',
  },
  boardHandle: {
    position: 'absolute',
    right: 6,
    top: 8,
    width: 12,
    height: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C08646',
  },
  boardFood: {
    position: 'absolute',
    left: 10,
    top: 7,
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#5AAA57',
  },
  foodPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 8,
  },
  foodGreen: {
    backgroundColor: '#4DB36A',
  },
  foodOrange: {
    backgroundColor: '#F08A45',
  },
  spoonContainer: {
    position: 'absolute',
    top: 46,
    left: 142,
    width: 38,
    height: 132,
    alignItems: 'center',
  },
  spoonHandle: {
    width: 8,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#43A261',
  },
  spoonNeck: {
    width: 5,
    height: 8,
    marginTop: -1,
    borderRadius: 3,
    backgroundColor: '#4B5568',
  },
  spoonHead: {
    width: 28,
    height: 42,
    marginTop: -3,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderColor: '#4B5568',
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
  },
  spiceJarContainerLeft: {
    position: 'absolute',
    bottom: 78,
    left: 34,
    width: 22,
    height: 38,
    alignItems: 'center',
  },
  spiceJarContainerRight: {
    position: 'absolute',
    bottom: 78,
    left: 74,
    width: 22,
    height: 38,
    alignItems: 'center',
  },
  spiceCap: {
    width: 13,
    height: 6,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: '#5F6777',
  },
  spiceBody: {
    width: 16,
    height: 28,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: '#F6F7FA',
    borderWidth: 1,
    borderColor: '#D6DAE0',
  },
  spiceBodyDark: {
    backgroundColor: '#E9EDF3',
  },
  spiceDropOne: {
    position: 'absolute',
    left: 44,
    top: 156,
    width: 4,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5BF6D',
  },
  spiceDropTwo: {
    position: 'absolute',
    left: 84,
    top: 156,
    width: 4,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D7AB57',
  },
  potLeftHandle: {
    position: 'absolute',
    bottom: 96,
    left: 88,
    width: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#424B5E',
  },
  potRightHandle: {
    position: 'absolute',
    bottom: 96,
    left: 220,
    width: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#424B5E',
  },
  potBody: {
    position: 'absolute',
    bottom: 78,
    left: 102,
    width: 118,
    height: 62,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#37A657',
    overflow: 'hidden',
  },
  potHighlight: {
    position: 'absolute',
    left: 34,
    top: 0,
    width: 50,
    height: 62,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#66C17E',
  },
  potRim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 7,
    backgroundColor: '#2A7F44',
  },
  steam: {
    position: 'absolute',
    top: 120,
    width: 6,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#ECF3F1',
  },
  steamTall: {
    height: 28,
    width: 5,
  },
  bottleContainer: {
    position: 'absolute',
    bottom: 78,
    right: 52,
    width: 30,
    height: 78,
    alignItems: 'center',
  },
  bottleCap: {
    width: 10,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#6B7280',
  },
  bottleBody: {
    width: 20,
    height: 62,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: '#D0D5DB',
    backgroundColor: '#F7F8FB',
  },
  bottleLabel: {
    position: 'absolute',
    bottom: 14,
    width: 15,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#273142',
  },
  oilDrop: {
    position: 'absolute',
    right: 58,
    top: 152,
    width: 4,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#E2C84C',
  },
  stoveTop: {
    position: 'absolute',
    bottom: 64,
    left: 62,
    width: 202,
    height: 14,
    borderRadius: 10,
    backgroundColor: '#2E3444',
  },
  stoveShadow: {
    position: 'absolute',
    bottom: 62,
    left: 72,
    width: 186,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#1F2532',
    opacity: 0.18,
  },
  statusBlock: {
    alignItems: 'center',
    marginTop: 2,
    width: '100%',
  },
  statusText: {
    fontSize: 22,
    color: BRAND_RED,
    marginBottom: 18,
  },
  progressTrack: {
    width: 224,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#EBC7CC',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: BRAND_RED,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    borderRadius: 24,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 18,
  },
  modalButton: {
    height: 48,
    borderRadius: 999,
    backgroundColor: BRAND_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 19,
  },
});
