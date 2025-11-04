import React from 'react'
import { Folder as FolderIcon } from 'lucide-react'


type FolderProps = {
  folderName: string,
  videosCount: number,
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const Folder = ({ folderName,  videosCount, onClick }: FolderProps) => {
  return (
    <button className="px-4 py-2 border border-border bg-card flex rounded-sm justify-between items-center w-[200px] relative overflow-hidden hover:cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all text-start" onClick={onClick}>
      <div>
        <h4 className="font-semibold text-[14px]  text-card-foreground truncate max-w-[16ch]">{folderName}</h4>
        <h5 className="text-muted-foreground text-xs capitalize">{videosCount} videos</h5>
      </div>
      <FolderIcon fill={"white"} />
      <div className="absolute blur-3xl w-[100px] h-[100px] bg-[#ddd] -top-[50px] -left-[50px] opacity-15 rounded-full">
      </div>
    </button>
  )
}

export default Folder