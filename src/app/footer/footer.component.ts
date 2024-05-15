import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { runInThisContext } from 'vm';
import { ChatbotComponent } from '../chatbot/chatbot/chatbot.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  ShowChatBot = false;
  ShowChatIcon = true;
  dialogRef: any;
  errorMessage: string;
  constructor(public dialog: MatDialog) { }
  date: string
  ngOnInit() {
    this.date = new Date().getFullYear().toString()
  }

  chatbot() {
    this.dialogRef = this.dialog.open(ChatbotComponent, {
      width: "500px"
    });
    this.dialogRef.afterClosed().subscribe(() => {
    });
    if (this.ShowChatBot) {
      this.ShowChatBot = false
      this.ShowChatIcon = true;
    } else {
      this.ShowChatBot = true;
      this.ShowChatIcon = false;
    }
    console.log("this.ShowChatBot", this.ShowChatBot)
  }

}
