import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import { theme as customColors } from './colors';

export const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: customColors.colors.primary,
        background: customColors.colors.background,
        surface: customColors.colors.surface,
        onSurface: customColors.colors.text,
        secondary: customColors.colors.accent,
    },
};
