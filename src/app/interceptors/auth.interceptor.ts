import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // on récupère le jeton mis de côté
  const token = localStorage.getItem('token');

  // si le jeton existe, on le glisse dans le header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        // format standard bearer pour l'api
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // sinon on laisse passer la requête telle quelle
  return next(req);
};
