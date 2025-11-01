import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon, Upload, File } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";


type FileUploadProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}
type UploadStatus = "idle" | "success" | "uploading" | "error";

const FileUpload = ({ setFile }: FileUploadProps) => {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [status, setStatus] = useState<UploadStatus>("idle");
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

  }
  return (
    <>
      <div className="flex items-center justify-between border-b-border border-b px-2 py-1">
        <h1 className="font-fold text-card-foreground">File Upload</h1>
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className={`ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      <div className="h-[400px] w-[700px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center relative">
            <Upload className="text-muted-foreground" width={68} height={68} />
            <div className="size-40 bg-[#d9d9d9]/15 blur-2xl absolute -z-10 rounded-full "></div>
          </div>
          <h1 className="text-card-foreground font-semibold">
            Select Video Files Using The Button Below To Upload
          </h1>
          <Button>
            <label className="flex items-center gap-2 cursor-pointer" htmlFor="file-upload">
              <File />
              Select Files
            </label>
          </Button>
          <input id="file-upload" type="file" hidden onChange={handleFileChange} />
        </div>
      </div>
    </>
  );
};

export default FileUpload;
