import {Component, OnDestroy, OnInit} from '@angular/core';
import {APIResponse, Game} from '../../models';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sort: string;
  public games: Array<Game>;
  public routerSub: Subscription;
  private gameSub: Subscription;
  constructor(private acticatedRoute: ActivatedRoute, private router: Router,
              private httpService: HttpService, ) { }

  ngOnInit(): void {
    this.routerSub = this.acticatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']){
        this.searchGame('metacrit', params['game-search']);
      } else {
        this.searchGame('metacrit');
      }
    });
  }

  searchGame(sort: string, search?: string): void {
    this.gameSub = this.httpService.getGamelist(sort, search).subscribe((gameList: APIResponse<Game>) => {
      this.games = gameList.results;
      console.log(gameList);
    });
  }

  openGameDetail(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    if (this.gameSub){
      this.gameSub.unsubscribe();
    }

    if (this.routerSub){
      this.routerSub.unsubscribe();
    }
  }
}
