import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  name: string
  isLogin: boolean = false;
  buttonTxt: string = 'Login'
  headerTxt: string = 'Signup'
  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }
  async onSignup() {
    console.log('this.name', this.name);
    const loggedInUser = await this.userService.signup(this.name);
    if (!loggedInUser) {
      console.log('user name allready exists!');
      this.messageService.save(`The name you picked allread exists.`)
    } else {
      await this.userService.login(loggedInUser.name);
      this.userService.saveIsLoggedIn(true)
      this.router.navigateByUrl('');
    }
  }

  async onLogin() {
    console.log('this.name', this.name);
    const loggedInUser = await this.userService.login(this.name);
    if (!loggedInUser) {
      this.messageService.save(`No such name in the system.`)
    } else {
      this.userService.saveIsLoggedIn(true)
      this.router.navigateByUrl('');
    }
  }
  showLogin() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.buttonTxt = 'Signup';
      this.headerTxt = 'Login';
    }
    else {
      this.buttonTxt = 'Login';
      this.headerTxt = 'Signup';
    }
  }

}
