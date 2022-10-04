import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import Swal from "sweetalert2";

export default function Footer({
  structure,
  setStructure,
  currentPath,
  selection,
  deletePaths,
  reload,
  rename,
  labels,
  enabledFeatures,
}) {
  const list = structure[currentPath] || [];
  const files = list.filter((item) => item.type === 1).length;
  const folders = list.filter((item) => item.type === 2).length;
  const folderLabel =
    folders === 1 ? labels.folderSingle : labels.folderMultiple;
  const fileLabel = files > 1 ? labels.fileMultiple : labels.fileSingle;

  const onDeletePath = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert ${selection}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", `${selection} has been deleted.`, "success");
      }
    });

    // deletePaths(selection)
    // 	.then(() => {
    // 		setStructure({})
    // 		reload()
    // 	})
    // 	.catch((error) => error && console.error(error))
  };

  const onRename = async () => {
    // rename(selection[0])
    // 	.then(reload)
    // 	.catch((error) => error && console.error(error))

    const { value: entryName } = await Swal.fire({
      title: "Rename Entry",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
        return value;
      },
    });
  };

  return (
    <div className="FileManager-Footer">
      <div className="Footer-Left">
        {folders} {folderLabel} {files > 0 ? ` and ${files} ${fileLabel}` : ""}
      </div>
      <div className="Footer-Right">
        <Tooltip title={labels.rename}>
          <IconButton
            color="inherit"
            onClick={() => onRename()}
            disabled={
              selection.length !== 1 || enabledFeatures.indexOf("rename") === -1
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={labels.delete}>
          <IconButton
            color="inherit"
            onClick={() => onDeletePath()}
            disabled={
              !selection.length || enabledFeatures.indexOf("deletePaths") === -1
            }
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
