import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {bookdata.title}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {bookdata.title}
          </Typography>
          <Typography variant="body3" gutterBottom>
            Author: {bookdata.author_id}
          </Typography>{" "}
          <Typography variant="body2" gutterBottom>
            Genre: {bookdata.genre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ISBN: {bookdata.isbn}
            {bookdata.img}
          </Typography>{" "}
          <Typography variant="body2" color="text.secondary">
            Publisher: {bookdata.publisher}, {bookdata.publication_year}
          </Typography>
          <button type="button" onClick={() => onClose(false)} />
        </Box>
      </Modal>
    </div>
  );
}
