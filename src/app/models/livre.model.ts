export interface Commentaire {
  id: number;
  pseudo: string;
  texte: string;
  note: number;
}

export interface Livre {
  uuidLivre?: string;
  titre: string;
  auteur: string;
  editeur: string;
  isbn?: string;
  categorie?: string;
  description?: string;
  couverture?: string;
  page?: number;
  exemplaireDisponible: number;
  exemplaireTotal: number;
  datePublication?: string;
  dateAjout?: string;
  note?: number;
  commentaires?: any[];
}
