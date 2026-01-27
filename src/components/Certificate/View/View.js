import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function View({ data, onClose }) {
  return (
    <Box sx={{
      width: "900px",
      height: "630px",
      mx: "auto",
      backgroundImage: "url(/sidebar/certification.png)",
      backgroundSize: "cover",
      position: "relative",
    }}>
      <IconButton onClick={onClose} sx={{ position:"absolute", right:10, top:10 }}>
        <CloseIcon />
      </IconButton>

      <Typography sx={{ position:"absolute", top:"48%", left:"50%", transform:"translate(-50%,-50%)", fontSize:38 }}>
        {data.name}
      </Typography>
    </Box>
  );
}
