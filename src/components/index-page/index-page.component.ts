import { Component, OnInit, signal } from '@angular/core';
import {
  convertDocxToPDF,
  convertImageToBase64,
  generatePDF,
} from '../../utils/utils';

@Component({
  selector: 'app-index-page',
  imports: [],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  selectedUploadType = signal('');
  imageFiles = signal([]);
  wordFile = signal(null);
  imageBase64List = signal([]);

  ngOnInit(): void {
    this.selectedUploadType.set('imageUpload');
  }

  onWordFileChange = (event: any) => {
    this.wordFile.set(event.target.files[0]);
  };

  onImageFileChange = (event: any) => {
    let imageArray: any = [...this.imageFiles()];
    imageArray.push(event.target.files[0]);
    this.imageFiles.set(imageArray);

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      convertImageToBase64(input.files[0])
        .then((base64: any) => {
          let base64List: any = [...this.imageBase64List()];
          base64List.push(base64);
          this.imageBase64List.set(base64List);
        })
        .catch((error: any) => {
          console.error('Error converting image:', error);
        });
    }
  };

  onUploadTypeChange = (event: any) => {
    this.selectedUploadType.set(event.target.value);
  };

  onResetImageClick = () => {
    this.imageFiles.set([]);
    this.imageBase64List.set([]);
  };

  onGenerateClick = () => {
    this.selectedUploadType() === 'imageUpload'
      ? generatePDF(this.imageFiles())
      : convertDocxToPDF(this.wordFile());
  };
}
