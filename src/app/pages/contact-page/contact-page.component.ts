import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';
import { ContactService } from 'src/app/services/contact.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})

export class ContactPageComponent implements OnInit {
  contacts$!: Observable<Contact[]>
  msgs$: Observable<any[]>
  constructor(private contactService: ContactService, private meassageService: MessageService,private router: Router) { }
  ngOnInit(): void {
    this.contactService.loadContacts();
    this.contacts$ = this.contactService.contacts$
    this.msgs$ = this.meassageService.msgs$
  }
  onRemoveContact(contactId:string){
    this.contactService.deleteContact(contactId);
  }
  onAddContact(){
    this.router.navigateByUrl('/edit')
  }

}
