import { Injectable } from '@angular/core';
import { Show } from '../model/show';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class ShowDataService {

  shows: Observable<Show[ ]>;
  private serien = 'table_show';
  detailShow: Show;

  constructor(private httpClient: HttpClient, private af: AngularFirestore) {
    this.shows = af.collection(this.serien).valueChanges({idField: 'uid'}) as Observable<Show[ ]>;
  }

  async saveShow(show: Show) {
    try {
      const data: any = await this.httpClient.get('https://api.tvmaze.com/singlesearch/shows?q=' + show.title).toPromise();
      if (data.name != null) {
        this.af.collection(this.serien).add({
          id: show.id,
          title: show.title
        });
      }
    } catch(e) {
      alert('Für die eingegebene Show konnte kein Verzeichniseintrag gefunden werden!');
    }
  }

  saveEditShow(show: Show) {
    this.af.collection(this.serien).doc(show.uid).update({
      id: show.id,
      title: show.title
    })
  }

  deleteShow(show: Show) {
    this.af.collection(this.serien).doc(show.uid).delete();
  }

  async showShowDetails(show: Show) {
    try{
      const data: any = await this.httpClient.get('https://api.tvmaze.com/singlesearch/shows?q=' + show.title).toPromise();
      show.summary = data.summary;
      show.image = data.image.medium; //replace('http', 'https') entfernt, da JSON-String nun mit https
      this.detailShow = show;
    } catch (e) {
      alert('Es wurde leider keine passende Show gefunden!');
    }
  }
}