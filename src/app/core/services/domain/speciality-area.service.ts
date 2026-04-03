import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { HttpService } from '../infrastructure/http.service';
import { SpecialtyAreaResponseModel } from '../../models/specialty-area/specialty-area-response.model';


@Injectable({ providedIn: 'root' })
export class SpecialityAreaService {
 

  constructor(private httpService: HttpService) {
  }


GetList(): Observable<SpecialtyAreaResponseModel[]> {
    return this.httpService.get<SpecialtyAreaResponseModel[]>(API_ENDPOINTS.SpecialtyAreas.GetList).pipe(
      tap((response: SpecialtyAreaResponseModel[]) => {
        console.log('Specialty areas loaded:', response.length);
      })
    );
  }

}