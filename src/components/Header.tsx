import { UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Upload, Video } from "lucide-react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import FileUpload from "./FileUpload";
import { useState } from "react";



const Header = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
          <Dialog open={isOpen} onOpenChange={() => {
            if (!isOpen) {
              setFile(null);
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}>
            <DialogTrigger>
              <Button size="sm">
                <Upload />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} custom={true}>
              {!file ? (
                <FileUpload  setFile={setFile} />
              ) : (
                  <div className="asdfadsf">
                    {file.size}
                  </div>
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
