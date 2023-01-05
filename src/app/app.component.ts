import { Component } from '@angular/core';
import {
  Observable,
  of,
  interval,
  pipe,
  throwError,
  tap,
  map,
  retryWhen,
  delayWhen,
  EMPTY,
  NEVER
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientesService } from './clientes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  clientes: any = [];

  constructor(private clientesService: ClientesService) {}


  // Caso 1. Sin manejar el error
  ignoreErrorFunction() {

    const http$ = this.clientesService.getClients();
    http$.subscribe({
      next: (val) => (this.clientes = val),
      error: (err) => console.error('Error en la API:', err.message),
      complete: () => console.log('Completo'),
    });

  }

  // Caso 2. Atrapar el error y crear un nuevo observable (catch and replace)
  catchErrorFunction() {
    const http$ = this.clientesService.getClients();
    http$
      .pipe(
        catchError((err) => {
          console.log('No hay conexión con la API');
          //return of([]);
          //return EMPTY;       
          return of([{ nombre: 'Fulano', apellidos: 'de Tal' }]);
        })
      )
      .subscribe({
        next: (val) => (this.clientes = val),
        error: (err) => console.error('Error en la API:', err),
        complete: () => console.log('Completo'),
      });
  }

  // Caso 3. Atrapar el error y emitir un nuevo error (catch and rethrow)
  throwingErrorFunction() {
    const http$ = this.clientesService.getClients();
    http$
      .pipe(
        catchError((err) => {
          console.log('No hay conexión con la API');
          return throwError(() => new Error(err));
        })
      )
      .subscribe({
        next: (val) => (this.clientes = val),
        error: (err) => console.error('Error en la API:', err),
        complete: () => console.log('Completo'),
      });
  }

  // Caso 4. Reintentar la petición (catch and retry)
  retryFunction() {
    const http$ = this.clientesService.getClients();
    http$
      .pipe(
        tap(() => console.log('Petición HTTP ejecutada')),
        retryWhen((errors) => {
          return errors.pipe(tap(() => console.log('Reintentando...')));
        })
      )
      .subscribe({
        next: (val) => (this.clientes = val),
        error: (err) => console.error('Error en la API:', err),
        complete: () => console.log('Completo'),
      });
  }


  // Caso 5. Esperar y reintentar la petición (catch and retry)
  retryWithDelayFunction() {
    const http$ = this.clientesService.getClients();
    http$
      .pipe(
        tap(() => console.log('Petición HTTP ejecutada')),
        retryWhen((errors) => {
          return errors.pipe(
			delayWhen(()=>interval(2000)),
			tap(() => console.log('Reintentando...')));
        })
      )
      .subscribe({
        next: (val) => (this.clientes = val),
        error: (err) => console.error('Error en la API:', err),
        complete: () => console.log('Completo'),
      });
  }

  ngOnInit() {

/* 	// Caso 1. Sin manejar el error
 	this.ignoreErrorFunction();  */

/*     // Caso 2. Atrapar el error y crear un nuevo observable
	this.catchErrorFunction(); */

/*      // Caso 3. Atrapar el error y emitir un nuevo error	
 	this.throwingErrorFunction(); */

/*     // Caso 4. Reintentar la petición
    this.retryFunction(); */

  	// Caso 5. Esperar y reintentar la petición	
  	this.retryWithDelayFunction(); 
  }
}
