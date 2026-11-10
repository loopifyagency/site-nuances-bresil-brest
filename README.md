# Nuances Brésil Brest Harteloire

Site one-page du salon de coiffure **Nuances Brésil Brest Harteloire** (2 rue Bernard Scheidhauer, 29200 Brest).
Objectif : faire prendre rendez-vous (Planity) ou appeler.

Direction artistique : **« Le miroir »**. Le site est le mur du salon : miroirs ronds sur papier peint de feuilles, sous des ampoules suspendues. Sable, blanc et gris pour le décor, l'ambre des ampoules pour seul accent. Voir `DESIGN.md` pour le système complet et `PRODUCT.md` pour les faits de référence.

## Pile technique

HTML / CSS / JavaScript statique, **sans étape de build**. Tout est local :

| Rôle | Fichier |
|---|---|
| Page | `index.html` |
| Styles | `assets/css/style.css` |
| Mouvement et interactions | `assets/js/main.js` |
| GSAP 3.15.1, ScrollTrigger, SplitText, Lenis 1.3.27 | `assets/vendor/` |
| Polices (Bricolage Grotesque, Figtree), auto-hébergées | `assets/fonts/` |
| Photos du salon (fournies par le client) | `assets/img/` |

GSAP est utilisé sous sa licence « no charge » (gsap.com/standard-license). Les polices sont sous licence SIL OFL (textes dans `assets/fonts/`). Lenis est sous licence MIT.

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. N'importe quel serveur statique convient.

## Déployer (GitHub Pages)

Le site est publié par le workflow `.github/workflows/pages.yml` à chaque fusion dans `main` (ou à la main, onglet *Actions* puis *Run workflow*). Seuls `index.html`, `robots.txt`, `sitemap.xml` et `assets/` sont publiés.

Réglage à faire une seule fois : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Adresse : https://loopifyagency.github.io/site-nuances-bresil-brest/

Avec un nom de domaine personnalisé, mettre à jour l'URL canonique, les balises `og:` et le JSON-LD dans `index.html`, ainsi que `robots.txt` et `sitemap.xml`.

## Ce qui reste à confirmer ou à fournir

Le site ne contient aucun chiffre, prix ni avis inventé. À vérifier avant la mise en ligne :

- **Vrac** : le texte (section « Votre flacon, rempli sur place » et dernier chapitre du salon) décrit un remplissage de flacons sur place, déduit du mur « VRAC » visible sur la photo. À confirmer ou corriger.
- **Chiffres clés** : 59 h par semaine, 6 jours sur 7 et 12 textures (1A à 4C) sont dérivés des horaires et de la classification courante des textures. Pour afficher des chiffres réels (années d'ouverture, clients accompagnés…), modifier la phrase de `#chiffres` dans `index.html` : chaque nombre est un `<span class="odo" data-odo="…">`.
- **Prestations** : les six cartes sont tirées des avis réels. Aucun tarif n'est affiché, la carte complète renvoie vers Planity. Une liste exacte permettrait d'ajuster les cartes.
- **Accroche** : « lisses, ondulés, bouclés ou crépus » suppose que le salon accueille toutes les textures.
- **Logo** : aucun fichier fourni. La marque en en-tête (anneau + boucle) est un repère provisoire à remplacer par le logo officiel (visible sur la façade).
- **Mentions légales** : non incluses.
- **Carte** : l'iframe Google Maps ne s'affiche qu'avec un accès réseau ; tout le bloc est cliquable vers Google Maps (nouvel onglet).

## Accessibilité et mouvement

Lien d'évitement, navigation au clavier, textes alternatifs en français, contrastes ≥ 4,5:1 vérifiés. Sous `prefers-reduced-motion`, le préchargeur, le défilement lissé, les sections pinnées et toutes les animations sont désactivés : le contenu s'affiche tel quel. Sur mobile, l'inclinaison 3D, le curseur et le pinning sont remplacés par des versions simples (la visite devient un carrousel à glisser).
