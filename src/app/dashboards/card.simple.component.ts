import { Component, EventEmitter, Output, Input } from '@angular/core';


@Component({
  selector: 'app-sac-card',
  templateUrl: 'card.simple.component.html',
  styleUrls: ['card.simple.component.css'],
})

export class CardComponent {

  @Input() cardImage: string;
  @Input() title: string;
  @Input() bodyText: string;

  @Output() headerClick = new EventEmitter();
  @Output() readMoreClick = new EventEmitter();

  tempRating: number = 0;

  headerClicked() {
    this.headerClick.emit();
  }

  readMoreClicked() {
    this.readMoreClick.emit();
  }

  getFirstWords(str: string, number: number) {
    return str.split(/\W/, number).join(' ');
  }

}
