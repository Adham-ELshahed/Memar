import { useTranslations } from 'next-intl';
import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold">
          Meamar - Next.js Migration
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Construction Marketplace - Qatar
        </Typography>
        <Typography variant="body1">
          Successfully set up Next.js 14 with Material UI and bilingual support!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            Browse Products
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
