import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function BasicModal(props) {
  const { open, onClose, bookdata } = props;
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {bookdata.title}
          </Typography>
          <Img
            alt="book image"
            onError={e => console.log("e", e)}
            src={bookdata.img}
          />
          <Typography variant="body3" gutterBottom>
            Author: {bookdata.author_name} <br />
            <br />
          </Typography>

          <Typography variant="body1" gutterBottom>
            Description: {bookdata.description} <br /> <br />
          </Typography>
          <Typography variant="body2" gutterBottom>
            Genre: {bookdata.genre}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ISBN: {bookdata.isbn}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Publish Year: {bookdata.publishyear}, {bookdata.publication_year}
          </Typography>
          <input
            className={"inputButton"}
            type="button"
            onClick={() => onClose(false)}
            value="Close"
          />
        </Box>
      </Modal>
    </div>
  );
}

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "30%",
  maxHeight: "30%"
});
