import {Component, EventEmitter, Output} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {FileSelectEvent} from 'primeng/fileupload';

@Component({
  selector: 'file-picker-component',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css'],
  providers: [MessageService]
})
export class FilePickerComponent {
  @Output() filesSelected = new EventEmitter<File[]>();
  files: File[] = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;

  constructor(private config: PrimeNGConfig, private messageService: MessageService) {}

  choose(event: any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: { size: any; }, removeFileCallback: (arg0: any, arg1: any) => void, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: FileSelectEvent ) {
    this.files = event.currentFiles;
    this.filesSelected.emit(this.files);
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }


  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes?.[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes?.[i]}`;
  }
}
