import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const formatDate = (timestamp) => {
  const date = timestamp.toDate();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(2);
  return `${day}/${month}/${year}`;
};

const RecentActivity = ({ tutorials }) => {
  // Sort tutorials based on createdAt in descending order
  const sortedTutorials = tutorials.slice().sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return (
    <Paper elevation={3} style={{ padding: '5px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginTop: '10px' }}>
        Recent Activity
      </Typography>
      <TableContainer>
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow style={{ background: '#f2f2f2' }}>
              <TableCell style={{ width: '33%' }}>Title</TableCell>
              <TableCell style={{ width: '40%' }}>Created By</TableCell>
              <TableCell style={{ width: '25%' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTutorials.map((tutorial, index) => (
              <TableRow key={tutorial.tutorial_id} style={{ cursor: 'pointer', background: index % 2 === 0 ? '#f9f9f9' : 'inherit' }}>
                <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tutorial.title}
                </TableCell>
                <TableCell>{tutorial.created_by}</TableCell>
                <TableCell>{formatDate(tutorial.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const Index = () => {
  const tutorials = useSelector(
    ({
      tutorialPage: {
        feed: { homepageFeedArray },
      },
    }) => homepageFeedArray
  );

  return (
    <Box>
      <RecentActivity tutorials={tutorials} />
    </Box>
  );
};

export default Index;
