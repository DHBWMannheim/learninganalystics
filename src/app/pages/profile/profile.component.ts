import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private readonly afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  
  }

  test() {
    // this.afAuth.
  }

}
