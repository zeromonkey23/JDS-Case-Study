import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message'
import { Subscription } from 'rxjs';


@Component({
  selector: 'jds-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('uploadKTPFile', { static: false }) uploadKTPFile!: ElementRef;
  @ViewChild('uploadKKFile', { static: false }) uploadKKFile!: ElementRef;
  
  form = this.fb.group({
    name: [null, Validators.required],
    nik: [null, Validators.required],
    nkk: [null, Validators.required],
    ktp: [null, Validators.required],
    kk: [null, Validators.required],
    age: [null, [Validators.required, Validators.min(25)]],
    gender: ['L', Validators.required],
    address: [null, Validators.required],
    rt: [null, [Validators.required, Validators.min(1), Validators.max(13)]],
    rw: [null, [Validators.required, Validators.min(1), Validators.max(9)]],
    incomeBefore: [null, Validators.required],
    incomeAfter: [null, Validators.required],
    reasonOption: [null, Validators.required],
    reason: [null],
    agreement: [false],
  });

  isLoading = false;
  sub: Subscription[] = [];

  get nameControl() { return this.form.get('name'); }
  get nikControl() { return this.form.get('nik'); }
  get nkkControl() { return this.form.get('nkk'); }
  get ktpControl() { return this.form.get('ktp'); }
  get kkControl() { return this.form.get('kk'); }
  get ageControl() { return this.form.get('age'); }
  get genderControl() { return this.form.get('gender'); }
  get addressControl() { return this.form.get('address'); }
  get rtControl() { return this.form.get('rt'); }
  get rwControl() { return this.form.get('rw'); }
  get incomeBeforeControl() { return this.form.get('incomeBefore'); }
  get incomeAfterControl() { return this.form.get('incomeAfter'); }
  get reasonOptionControl() { return this.form.get('reasonOption'); }
  get reasonControl() { return this.form.get('reason'); }
  get agreementControl() { return this.form.get('agreement'); }

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
  ) { }
  
  ngOnInit(): void {
    this.onFormChange();
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  onFormChange() {
    this.sub.push(this.reasonOptionControl!.valueChanges.subscribe(async val => {
      if (this.reasonOptionControl?.value === 'Lainnya') {
        this.reasonControl?.setValidators(Validators.required);
        this.reasonControl?.updateValueAndValidity();
      } else {
        this.reasonControl?.clearValidators();
        this.reasonControl?.reset();
      }
    }));
  }

  openKTPUploadDialog() {
    this.uploadKTPFile.nativeElement.click();
  }

  onKTPFileChange(event: any): void {
    const file = (event && event.target?.files[0]) ?? null;
    if (file.size > 2000000) {
      this.message.error(
        'Gambar yang anda masukkan tidak boleh lebih dari 2 MB'
      );
      return;
    }
    this.ktpControl?.setValue(file);
    this.ktpControl?.updateValueAndValidity();
  }

  openKKUploadDialog() {
    this.uploadKKFile.nativeElement.click();
  }

  onKKFileChange(event: any): void {
    const file = (event && event.target?.files[0]) ?? null;
    if (file.size > 2000000) {
      this.message.error(
        'Gambar yang anda masukkan tidak boleh lebih dari 2 MB'
      );
      return;
    }
    this.kkControl?.setValue(file);
    this.kkControl?.updateValueAndValidity();
  }

  submit(): void {
    for (const controlName of Object.keys(this.form.controls)) {
      this.form.controls[controlName].markAsDirty();
      this.form.controls[controlName].updateValueAndValidity();
    }

    if (this.form.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        if (Math.random() < 0.5) {
          console.log('success form value:', this.form.value);
          this.message.success('Data berhasil di simpan');
        } else {
          console.log('failed form value:', this.form.value);
          this.message.error('Data gagal di simpan, silahkan coba lagi');
        }
      }, 1500)
    } else {
      if (!this.ktpControl?.value) {
        this.message.error('Mohon upload foto ktp');
      }
      if (!this.kkControl?.value) {
        this.message.error('Mohon upload foto kk');
      }
    }
  }

}