import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RulesComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
