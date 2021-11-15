import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact-edit-page',
  templateUrl: './contact-edit-page.component.html',
  styleUrls: ['./contact-edit-page.component.scss']
})
export class ContactEditPageComponent implements OnInit {
  contact: Contact
  subscription: Subscription
  form:FormGroup
  header:string= 'Edit'
  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe(data => {
      console.log('data', data);
      this.contact = data.contact || this.contactService.getEmptyContact() as Contact
      if (this.contact.name==='') this.header = 'Add';
      this.form = this.fb.group({
        name: [this.contact.name, Validators.required],
        phone:[ this.contact.phone, Validators.required],
        email: [this.contact.email, Validators.required]
      })

    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  async onSaveContact(formVal) {
    this.contact.name = formVal.name
    this.contact.phone = formVal.phone
    this.contact.email = formVal.email
    this.contactService.saveContact(this.contact)
    this.router.navigateByUrl('/contact')
  }
  onRemveContact(){
    
    this.contactService.deleteContact(this.contact._id)
    this.router.navigateByUrl('/contact')
  }
}
