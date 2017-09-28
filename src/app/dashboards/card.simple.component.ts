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
  @Input() origin: string;
  @Input() originUrl: string;
  @Input() tempRating: number;

  @Output() headerClick = new EventEmitter();
  @Output() readMoreClick = new EventEmitter();


  getProgressLabel(value: number): string {
    if (value < 0.1) {
      return '<10%';
    } else {
      return `${this.getProgressValue(value)}%`;
    }
  }

  getProgressValue(value: number): string {
    if (value < 0.1) {
      return '10';
    } else {
      return (value * 100).toFixed(0);
    }
  }

  headerClicked() {
    this.headerClick.emit();
  }

  readMoreClicked() {
    this.readMoreClick.emit();
  }

  getFirstWords(str: string, number: number) {
    return str.split(/\W/, number).join(' ');
  }

  getProgressType(value: number): string {
    if (value > 0.75) {
      return 'success';
    } else if (value > 0.5) {
      return 'info';
    } else if (value > 0.1) {
      return 'warning';
    } else {
      return 'default';
    }
  }
}
