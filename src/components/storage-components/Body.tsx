/* eslint-disable no-console */
import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box, Modal, Paper, Typography } from "@mui/material";

export default function Body({
  structure,
  reload,
  currentPath,
  setCurrentPath,
  openFile,
  selection,
  setSelection,
  rename,
  enabledFeatures,
}: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fileProps, setFileProps] = React.useState({
    title: "",
    description: "",
    media: "",
    file_type: "",
  });

  const list = structure[currentPath] || [];

  const onRename = () => {
    rename(selection[0])
      .then(reload)
      .catch((error: any) => error && console.error(error));
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box
      className="FileManager-Body"
      component={Paper}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        setSelection([]);
      }}
    >
      {!!list && (
        <>
          {list.map((item: { name: {} | null | undefined; type: number }) => {
            const path = `${currentPath}/${item.name}`;
            const selected = selection.indexOf(path) !== -1;
            return (
              <div
                className={`Body-Item${selected ? " Item-Selected" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setSelection([path]);
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setSelection([]);
                  if (item.type === 1) {
                    openFile(path).then((fileMetaData: any) => {
                      console.log(fileMetaData);
                      setFileProps(fileMetaData);
                      handleOpen();
                    });
                  } else {
                    setCurrentPath(path);
                  }
                }}
                aria-hidden="true"
              >
                <div className="Body-Item-Icon">
                  {item.type === 1 ? <InsertDriveFileIcon /> : <FolderIcon />}
                </div>
                <div
                  className="Body-Item-Name"
                  title={item.name as string}
                  onClick={() => {
                    const range = window.getSelection();
                    if (
                      selection[0] === path &&
                      enabledFeatures.indexOf("rename") !== -1 &&
                      !range?.toString().length
                    ) {
                      onRename();
                    }
                  }}
                  aria-hidden="true"
                >
                  {item.name}
                </div>
              </div>
            );
          })}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {fileProps.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {fileProps.description}
              </Typography>
              {/* <img src={fileProps.media} alt="new" /> */}
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}
