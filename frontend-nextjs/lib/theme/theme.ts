import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (locale: 'en' | 'ar') => {
  const isRTL = locale === 'ar';

  const themeOptions: ThemeOptions = {
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      secondary: {
        main: '#dc004e',
        light: '#e33371',
        dark: '#9a0036',
        contrastText: '#fff',
      },
      background: {
        default: '#fafafa',
        paper: '#fff',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
    typography: {
      fontFamily: isRTL 
        ? '"Noto Sans Arabic", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
