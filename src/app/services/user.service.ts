import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Contact } from '../models/contact.model';
import { Move } from '../models/move.model';
import storageService from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  USER_KEY = 'loggedInUser'
  USERS = 'usersDb'
  // currLoggedInUser:Contact
  constructor() { }
  private _isLoggedInDb = []
  private _isLoggedIn$ = new BehaviorSubject([]);
  public isLoggedIn$ = this._isLoggedIn$.asObservable()

  public saveIsLoggedIn(isLoggedIn: boolean){
    this._add(isLoggedIn)
  }

  private _add(isLoggedIn: boolean){
    this._isLoggedInDb.push(isLoggedIn)
    this._isLoggedIn$.next([isLoggedIn])
    return of(isLoggedIn)
  }
  public async getLoggedInUser() {
    const loggedInUser: any = sessionStorage.getItem(this.USER_KEY)
    console.log(this.USER_KEY, JSON.parse(loggedInUser));
    if (!loggedInUser) return null;
    return JSON.parse(loggedInUser);
  }

  public async login(username) {
    const users = storageService.loadFromStorage(this.USERS)
    const loggedInUser = users.find(user => user.name === username)
    if (!loggedInUser) return null;
    else {
      console.log('auth service loggedInUser', loggedInUser);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(loggedInUser));
      return (loggedInUser);
    }
  }

  public async signup(name: string) {
    console.log('entered signup', name);
    const newUser = {
      name,
      email: '',
      phone: '',
      coins: 100,
      moves: []
    }
    let users = storageService.loadFromStorage(this.USERS);
    if (!users) {
      console.log('new user', name);

      const newUsers = [newUser];
      storageService.saveToStorage(this.USERS, newUsers);
      return newUser;
    } else {
      const usernameExist = users.find(user=> user.name ===name);
      console.log('usernameExist', usernameExist);
      
      if (usernameExist) return false;
      users.push(newUser);
      storageService.saveToStorage(this.USERS, users)
      return newUser;
    }
  }
  public logout(){
    sessionStorage.setItem(this.USER_KEY, null)
  }

  public addMove(transferAmount: number, toContact: Contact) {
    console.log('transferAmount', transferAmount);
    console.log('toContact', toContact);
    const sessionUser = JSON.parse(sessionStorage.getItem(this.USER_KEY))
    const users = storageService.loadFromStorage(this.USERS)
    const loggedInUser = users.find(user => user.name === sessionUser.name)
    loggedInUser.coins -= transferAmount;
    const newMove: Move = {
      toId: toContact._id,
      to: toContact.name,
      at: Date.now(),
      amount: transferAmount
    }
    loggedInUser.moves.push(newMove)
    console.log(loggedInUser);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(loggedInUser)); // to save in session storge
    this.updateUser(loggedInUser, users); //save users to local storage
  }

  updateUser(loggedInUser: Contact, users: Array<Contact>) {
    const userIdx = users.findIndex(user => user._id === loggedInUser._id)
    users.splice(userIdx, 1, loggedInUser);
    storageService.saveToStorage(this.USERS, users);
  }
  async getMovesList(currContact: Contact) {
    const loggedInUser: Contact = await this.getLoggedInUser()
    if (!currContact){
      const contactMoves = loggedInUser.moves;
      console.log('service home moves', contactMoves);
      return contactMoves;
    }
    const contactMoves = loggedInUser.moves.filter(move => move.toId === currContact._id)
    console.log(contactMoves);
    if (contactMoves.length>3) {
      console.log(contactMoves.length);
      contactMoves.splice(0,contactMoves.length-3)
    }
    return contactMoves;
  }
}
