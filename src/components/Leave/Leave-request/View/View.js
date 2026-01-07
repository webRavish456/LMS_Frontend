import { Box, Typography, Grid } from "@mui/material";

const ViewLeave = ({ viewData }) => {
  if (!viewData) return null;

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Leave Details
      </Typography>

      actions: (
  <>
    <IconButton
      color="primary"
      size="small"
      onClick={() => handleView(item)}
    >
      <MoreVertIcon />   {/* 👈 Yahan pe 3 dots aayega */}
    </IconButton>
    <IconButton
      color="error"
      size="small"
      onClick={() => handleDelete(item._id)}
    >
      <DeleteIcon />
    </IconButton>
  </>
),

    </Box>
  );
};

export default ViewLeave;
