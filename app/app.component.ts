import {Component} from "@angular/core";
import {Router, NavigationExtras} from "@angular/router";
import {NewsService} from "./services/news.service";
import { registerElement } from "nativescript-angular/element-registry";
let application = require('application');
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.css"],
    providers:[NewsService]
})
export class AppComponent {

    newsList;
    isLoading: boolean = false;
    constructor(private router: Router, public news: NewsService) {
        this.isLoading = true;
        application.android.on(application.AndroidApplication.activityBackPressedEvent, function (args) {
            return this.isLoading = false;
        });

        this.news.getNews().subscribe(data => {
            this.newsList = data;
            this.isLoading = false;
        })
    }



    public onTap(item: any) {
        this.isLoading = true;
        let navExtras: NavigationExtras = {
            queryParams:{
                "item" : JSON.stringify(item)
            }
        }

        this.router.navigate(['/page1'],navExtras);
    }


    public refreshList(args){
        let pullRefresh = args.object;
        this.news.getNews().subscribe(data => {
            this.newsList = data;
            pullRefresh.refreshing = false;
        })
    }

}
