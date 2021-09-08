import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KcService } from './kc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form = new FormGroup({
    login: new FormControl(''),
    password: new FormControl('')
  });

  constructor(public kcService: KcService) { }

  process() {
    const { login, password } = this.form.value;
    this.kcService.process(login, password).subscribe();
  }


}
