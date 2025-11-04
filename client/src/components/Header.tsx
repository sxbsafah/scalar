import { UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Upload, Video } from "lucide-react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import FileUpload from "./FileUpload";
import { useState } from "react";
import VideoForm from "./VideoForm";
import { DialogTitle } from "@/components/ui/dialog";

// type UploadStatus = "idle" | "success" | "uploading" | "error";


const Header = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <header className="flex items-center justify-between py-4 w-full mb-12">
      <div>
        <Input className={"w-[400px]"} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Button size="sm">
            <Video />
            Record
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button size="sm">
                <Upload />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} custom={true}>
              {!file ? (
                <>
                  <DialogTitle className="sr-only">File Uploading</DialogTitle>
                  <FileUpload  setFile={setFile} />
                </>
              ) : (
                  <>
                    <DialogTitle className="sr-only">Video Form</DialogTitle>
                    <VideoForm file={file} />
                  </>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
