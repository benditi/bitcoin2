import { AfterContentInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { Router } from '@angular/router';


@Component({
  selector: 'contact-preview',
  templateUrl: './contact-preview.component.html',
  styleUrls: ['./contact-preview.component.scss']
})
export class ContactPreviewComponent implements OnInit {
  @Input() contact!:Contact
  @Output() remove=  new EventEmitter<string>()
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onRemoveContact(ev){
    ev.stopPropagation()
    console.log(ev);
    this.remove.emit(this.contact._id)
  }
  goToDetails(ev){
    console.log(ev);
    this.router.navigateByUrl(`/contact/${this.contact._id}`);
  }
}
