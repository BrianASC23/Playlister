import { useContext } from "react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CatalogCard({ song }) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  return (
    <ListItem
      id={song._id}
      sx={{
        mt: 2,
        px: 2.5,
        py: 1,
        borderRadius: "5px",
        border: "solid 1px #d7d3d5",
        bgcolor: "#fef7ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box>
        <Typography>{song.title}</Typography>
        <Typography>{song.year}</Typography>
        <Box>
          <Typography>Listens</Typography>
          <Typography>In Playlists</Typography>
        </Box>
      </Box>
    </ListItem>
  );
}
