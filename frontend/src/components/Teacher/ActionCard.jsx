import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    id: 1,
    title: 'Create Events',
    description: 'Plants are essential for all life.',
    path: '/create-events',
  },
  {
    id: 2,
    title: 'Manage Course Flow',
    description: 'Animals are a part of nature.',
    path: '/manage-course',
  },
  {
    id: 3,
    title: 'Monitor Students',
    description: 'Humans depend on plants and animals for survival.',
    path: '/monitor-students-teacher',
  },
];

function SelectActionCard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '95%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
        gap: 12,
      }}
    >
      {cards.map((card) => (
        <Card key={card.id}>
          <CardActionArea
            onClick={() => navigate(card.path)} // 👈 navigate to page
            sx={{
              height: '100%',
              '&:hover': {
                backgroundColor: 'action.selectedHover',
              },
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;
