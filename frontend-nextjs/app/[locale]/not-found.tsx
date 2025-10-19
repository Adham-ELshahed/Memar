import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
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
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Page Not Found
        </Typography>
        <Button
          component={Link}
          href="/en"
          variant="contained"
          size="large"
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
