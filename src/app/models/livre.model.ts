export interface Livre {
  uuidLivre: string;
  titre: string;
  auteur: string;
  description: string;
  categorie: string;
  couverture: string;
  exemplaireTotal: number;
  exemplaireDisponible: number;
  commentaire?: string;
  note?: number;
}
