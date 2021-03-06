import { Component, Input, Output, NgZone, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { BusinessApi, BusinessList, BusinessListResponse } from 'client';
import { Cookie } from 'services';



@Component({
  selector: 'business-add',
  directives: [
    ...ROUTER_DIRECTIVES
  ],
  template: require('./add.html'),
  styles: [require('./add.scss')],
  providers: [HTTP_PROVIDERS, BusinessApi]
})


export class BusinessAddComponent {
  list: BusinessList;
  today: string = moment().format('YYYY-MM-DD');
  date: string = '2016-07-27' || moment().format('YYYY-MM-DD');
  page: any = { current: 1 };
  dateShow: boolean = false;
  timeout: any;
  shopChangeSub: Subscription;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi) {
    //   missionService.businessAddAnnounced$.subscribe(
    //   astronaut => {
    //     if (astronaut == 'business-list') {
    //       this.getList();
    //     }
    //   });

    //   this.shopChangeSub = this.thzsUtil.shopChanged$.subscribe( item => {
    //       console.log('business list: ', item);
    //       this.getList();
    //   } );


  }

  // 初始化
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    // this.shopChangeSub.unsubscribe();
  }
  onSwipeLeft(event) {
    event.preventDefault();
    event.target.parentNode.classList.add('swipeleft');
  }
  onSwipeRight(event) {
    event.preventDefault();
    event.target.parentNode.classList.remove('swipeleft');
  }
  // onPanUp(event, listTbody) {
  //   event.preventDefault();
  //   if (listTbody.scrollHeight == listTbody.scrollTop + listTbody.clientHeight) {
  //
  //     event.target.parentNode.parentNode.classList.add('panup');
  //     window.setTimeout(() => {
  //       event.target.parentNode.parentNode.classList.remove('panup');
  //     }, 1800);
  //   } else {
  //     event.target.parentNode.parentNode.classList.remove('panup');
  //   }
  // }
  onScrollEnd(next) {
    this.next = next;
    if (next&&!this.loading) {
      this.getList(true);
    }
  }

  onToggleDate(event) {
    event.stopPropagation();
    this.dateShow = !this.dateShow;
  }

  public closeDatePicker(event) {
    event.stopPropagation();
    this.dateShow = false;
  }

  moment(date, format = '') {
    return moment(date).format(format || 'YYYY-MM-DD');
  }


  onPickerChange(event) {
    this.date = event;
    this.getList();
  }

  onLastDate() {
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  onNextDate() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  isToday() {
    return moment(this.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
  }

  onOpen() {
    console.log('onOpen');
  }

  onClose() {
    this.getList();
  }

  changePage(event) {
    this.page.current = event.page;
    this.getList();
  }

  getList(scroll = false) {
      this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
        if (scroll&&!this.end) {
          this.page.current += 1;
        }
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(data => {
        if (data.meta.code === 200 && data.data) {
          if (scroll) {
            this.list.content = this.list.content.concat(data.data.content);
          } else {
            this.list = data.data;
          }
        } else {
          this.end = true;
        }
        this.loading = false;
      })
    }, 500)
  }

  onOpenBusinessAdd() {
    // this.missionService.confirmBusinessAdd({ selector: 'business-list' });
  }
}
