import { Component, OnInit,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
// import { API_URL } from '../../constants/constants';
import { environment } from '../../environments/environment';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  docUpload: any[] = [];
  messageService: any;
  name: any;
  more:FormArray;
  constructor(private userService: UserService, private fb:FormBuilder) {
    this.options = { concurrency: 1, maxUploads: 5 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

   }

  ngOnInit() {
  }
 

  productdata = this.fb.group({
    more :this.fb.array([this.addMore()])
  });




  addMore(): FormGroup {
    return this.fb.group({
    p_name:['',Validators.required],
    image : ['',Validators.required]

    })
  }

  get productsArray(){
    return <FormArray>this.productdata.get('more');
  }


  addProduct(){
    this.productsArray.push(this.addMore());
  }

  removeProduct(index){
    this.productsArray.removeAt(index);
  }


  

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added

      const event: UploadInput = {
        type: 'uploadAll',
        url: `${environment.apiBaseUrl}/product/fileUpload`,
        method: 'POST',
        data: { total_files: this.files.length.toString(), type: 'document' }
      };
      // console.log('event-=-=-==-=-===---==', event);

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    else if (output.type === 'done') {
      if (output.file.response.code == 200) {
        if(output)
        output.file.response.data.forEach(one => {
          this.docUpload.push(one)
        })
        // console.log(' this.do??cUpload ======',  this.docUpload);
      }
      else {
        this.messageService.add({ severity: 'error', detail: output.file.response.msg });
      }
    }
  }
  // ------------------END---------------------

ProductAdd() {
  const formData = new FormData();
  var data = {   
    Name: this.productdata.value,
    ProductImage: this.docUpload,
  }
  this.userService.addImage(data)
    .subscribe(res => {
      console.log('image upload success') ;
   },
      err => {
        console.log(err);
      }
    )
}
}
