---
name: Nuances Brésil Brest Harteloire
description: Le mur du salon en site web : miroirs ronds sur papier peint de feuilles, sous des ampoules suspendues. Sable, blanc et gris, avec la lumière ambre pour seul accent.
colors:
  ampoule-amber: "#F2B233"
  sable-dune: "#EFE7DB"
  lin-blanc: "#FBF8F2"
  galet-stone: "#DDD3C5"
  mur-papier: "#E4DACA"
  ardoise-slate: "#3A3733"
  encre-ink: "#1E1D1B"
  pierre-gray: "#55504A"
  pierre-clair: "#CFC6B9"
  brume-gray: "#A9A197"
typography:
  display-hero:
    fontFamily: "Bricolage Grotesque, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.1rem, 8.3vw, 8.4rem)"
    fontWeight: 780
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontVariation: "wdth 78"
  display-section:
    fontFamily: "Bricolage Grotesque, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.8vw, 5.6rem)"
    fontWeight: 720
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "wdth 82"
  title:
    fontFamily: "Bricolage Grotesque, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.3vw, 2.2rem)"
    fontWeight: 680
    lineHeight: 1.12
    letterSpacing: "-0.02em"
    fontVariation: "wdth 82"
  body:
    fontFamily: "Figtree, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Figtree, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1
  label-disc:
    fontFamily: "Bricolage Grotesque, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 720
    lineHeight: 1.22
    letterSpacing: "-0.01em"
    fontVariation: "wdth 85"
rounded:
  card: "16px"
  chip: "99px"
  mirror: "50%"
  arch: "999px 999px 16px 16px"
spacing:
  gutter: "clamp(1.25rem, 4.2vw, 4.5rem)"
  section: "clamp(5.5rem, 11vw, 10.5rem)"
  card-pad: "clamp(1.6rem, 2.6vw, 2.6rem)"
  gap: "clamp(0.85rem, 1.5vw, 1.4rem)"
components:
  button-disc:
    backgroundColor: "{colors.ampoule-amber}"
    textColor: "{colors.encre-ink}"
    typography: "{typography.label-disc}"
    rounded: "{rounded.mirror}"
    size: "clamp(8.75rem, 11vw, 10.75rem)"
  button-disc-hover:
    backgroundColor: "{colors.encre-ink}"
    textColor: "{colors.sable-dune}"
  button-disc-ink:
    backgroundColor: "{colors.encre-ink}"
    textColor: "{colors.sable-dune}"
    typography: "{typography.label-disc}"
    rounded: "{rounded.mirror}"
  button-pill:
    backgroundColor: "{colors.sable-dune}"
    textColor: "{colors.encre-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "3.1rem"
    padding: "0 1.45rem"
  button-pill-ink:
    backgroundColor: "{colors.encre-ink}"
    textColor: "{colors.sable-dune}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "3.1rem"
  button-pill-ink-hover:
    backgroundColor: "{colors.ampoule-amber}"
    textColor: "{colors.encre-ink}"
  card-service:
    backgroundColor: "{colors.lin-blanc}"
    textColor: "{colors.encre-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  card-service-dark:
    backgroundColor: "{colors.encre-ink}"
    textColor: "{colors.sable-dune}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  card-review:
    backgroundColor: "{colors.lin-blanc}"
    textColor: "{colors.encre-ink}"
    rounded: "{rounded.card}"
    padding: "clamp(1.6rem, 2.4vw, 2.3rem)"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.pierre-gray}"
    rounded: "{rounded.chip}"
    padding: "0.28rem 0.85rem"
---

# Design System: Nuances Brésil Brest Harteloire

## Overview

**Creative North Star: "Le miroir"**

Le site est le mur du salon, celui des photos : des miroirs ronds accrochés sur un papier peint de feuilles, sous des ampoules suspendues. Toute la structure descend de cette image. Une photo vit dans un cercle à double anneau, une section s'ouvre sur la suivante par un cercle qui s'agrandit, et la visite se termine là où chaque coupe se termine, devant le miroir, quand les ampoules s'allument et que la page se remplit d'ambre.

Le monde est accueillant et énergique sans être criard. Les surfaces sont des neutres chauds (sable, lin, galet) et deux pièces sombres (ardoise, encre). La seule couleur est la lumière des ampoules. Les titres sont lourds, étroits et serrés, posés en très grand ; le texte est rond et lisible. Rien n'est lisse pour le plaisir : chaque motif vient de la pièce réelle (miroirs, feuilles, suspensions, flacons en vrac, bois gravé), jamais d'un catalogue de décors.

**Key Characteristics:**
- Un seul accent chromatique, l'ambre, traité comme de la lumière et non comme une couleur de marque.
- Les cercles organisent la page : miroirs, disque d'action, pastilles, ouvertures de sections.
- Papier peint de feuilles géométriques, ton sur ton, uniquement sur des aplats.
- Titres géants en grotesque condensée lourde ; interlignes serrés sur les titres, confortables sur le texte.
- Mouvement chorégraphié section par section : aucune entrée n'est copiée d'une section à l'autre.

## Colors

Des neutres chauds pour le décor, une seule lumière pour l'accent.

### Primary
- **Ampoule Amber** (#F2B233) : la lumière. Disque d'action principal, ampoules, fond de la section finale, chiffres des compteurs, pastilles d'étapes, avatars des avis, soulignement du mot « nuance ». Texte posé dessus : toujours Encre Ink (8,98:1).

### Neutral
- **Sable Dune** (#EFE7DB) : sol de la page (accueil, prestations, vrac, contact). Fond de l'en-tête une fois défilé.
- **Lin Blanc** (#FBF8F2) : pièces claires (salon pinné, galerie) et surface des cartes et avis.
- **Galet Stone** (#DDD3C5) : surface secondaire (avis, carte homme, carte vrac, pastille de carte).
- **Mur Papier** (#E4DACA) : le mur de feuilles derrière les miroirs de l'accueil.
- **Ardoise Slate** (#3A3733) : pièce sombre chaude (chiffres, carte brushing).
- **Encre Ink** (#1E1D1B) : texte, anneaux de miroir, pièce sombre profonde (visite, carte boucles, pied de page).
- **Pierre Gray** (#55504A) : texte secondaire sur clair (6,50:1 sur Sable Dune).
- **Pierre Clair** (#CFC6B9) : texte secondaire sur sombre (9,97:1 sur Encre Ink).
- **Brume Gray** (#A9A197) : état « fermé » du point de statut, filets décoratifs. Jamais du texte.

### Named Rules
**The One Light Rule.** L'ambre est la seule couleur. Elle apparaît comme de la lumière (ampoule, disque, remplissage), jamais comme une seconde couleur de marque. Aucune autre teinte saturée n'entre dans le système.

**The Tone-on-Tone Rule.** Le papier peint de feuilles est tracé en encre à 11 % d'opacité : il prend la teinte du sol qu'il habille, sable, galet ou ambre. Il ne se pose jamais sur une photo ni sur une pièce sombre.

## Typography

**Display Font:** Bricolage Grotesque (Arial Narrow, Helvetica Neue, sans-serif), variable, largeur 76–88 %
**Body Font:** Figtree (Helvetica Neue, Arial, sans-serif), variable

**Character:** une grotesque lourde, étroite et un peu irrégulière pour les titres, qui tient en très grand, face à un texte rond et ouvert qui reste lisible sur téléphone. L'opposition de taille est volontairement brutale.

### Hierarchy
- **Display hero** (780, clamp(3.1rem, 8.3vw, 8.4rem), 0.9) : le titre de l'accueil uniquement, deux lignes masquées qui montent.
- **Display section** (720, clamp(2.5rem, 5.8vw, 5.6rem), 0.98) : titres de section, révélés ligne par ligne.
- **Title** (680, clamp(1.5rem, 2.3vw, 2.2rem), 1.12) : titres de cartes et d'étapes.
- **Body** (400, 1.0625rem, 1.62) : texte courant, mesure maximale 62ch.
- **Label** (650, 0.9375rem, 1) : navigation, boutons en pastille, tags.
- **Label disc** (720, 1.1875rem, 1.22, largeur 85 %) : intitulé du disque d'action.

### Named Rules
**The Giant-Then-Small Rule.** Un titre géant est toujours suivi d'un texte courant de taille normale, sans palier intermédiaire. Le contraste de taille fait la hiérarchie.

**The Tight-Only-Where-Huge Rule.** Les interlignes serrés (0,9 à 1,05) sont réservés aux titres de plus de 2,5 rem. Tout texte lu en paragraphe garde 1,3 ou plus (1,62 pour le courant).

## Layout

Une page, onze mouvements, un rythme vertical constant : chaque section prend `clamp(5.5rem, 11vw, 10.5rem)` en haut et en bas, plus d'espace au-dessus d'un titre qu'en dessous. Marge latérale unique `clamp(1.25rem, 4.2vw, 4.5rem)`. L'accueil place le texte à gauche (colonne de 50 vw) et le mur de feuilles à droite (48 %) avec les miroirs à cheval sur les deux.

Au-dessus de 900 px, deux sections se pinnent : le salon (un miroir qui s'ouvre quatre fois pendant 330 % de défilement) et la visite (défilement horizontal sur six étapes en zigzag). En dessous de 900 px, ou en mouvement réduit, la première s'empile et la seconde devient un carrousel à glisser natif. Les cartes de prestations suivent une grille de 12 colonnes aux formats volontairement inégaux (7/5 puis 5/7 puis 12), pas une rangée de cartes identiques.

## Elevation & Depth

Hybride : le fond se superpose par aplats de teintes (sable, lin, galet, ardoise, encre), et les objets se détachent par une ombre douce toujours décalée vers le bas. Pas de halo sans décalage, hormis la lumière des ampoules, qui est la seule source lumineuse du système.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 22px 44px -26px rgba(30,29,27,0.4), 0 2px 6px rgba(30,29,27,0.06)`) : cartes de prestations et d'avis.
- **Disc** (`box-shadow: 0 18px 30px -16px rgba(30,29,27,0.5), 0 3px 8px rgba(30,29,27,0.12)`) : disque d'action, badge rotatif.
- **Photo** (`box-shadow: 0 24px 40px -26px rgba(30,29,27,0.45), 0 2px 6px rgba(30,29,27,0.06)`) : photos de la galerie.

### Named Rules
**The Offset Rule.** Toute ombre a un décalage vertical et un flou. Aucun contour lumineux sans décalage, aucune ombre dure.

## Shapes

Le cercle est la forme du système. Les photos sont des miroirs : un disque de verre (`border-radius: 50%`) entouré d'un anneau d'encre de 2 px, séparé de 12 px. L'arche (`999px 999px 16px 16px`) sert à la galerie et rappelle le haut d'une porte. Les surfaces de contenu restent à 16 px de rayon ; les pilules (99 px) sont réservées aux petits contrôles et aux tags. Les sections s'ouvrent par des masques circulaires (`clip-path: circle()`), jamais par des balayages rectangulaires.

### Named Rules
**The Ring Rule.** Une photo hors galerie vit toujours dans un miroir à double anneau. Pas de photo carrée posée nue sur une section.

**The Open Rule.** Un nouvel élément visuel s'ouvre en cercle depuis son centre. Les rideaux rectangulaires sont réservés aux titres (lignes masquées qui montent).

## Components

### Buttons
- **Shape:** disque (50 %) pour l'action principale, pilule (99 px) pour les actions secondaires.
- **Disc primary:** fond Ampoule Amber, texte Encre Ink, diamètre `clamp(8.75rem, 11vw, 10.75rem)`, flèche dessinée en haut à droite. Au survol, un cercle d'encre grandit depuis le centre et le texte passe en Sable Dune. Attiré légèrement par le curseur sur pointeur précis.
- **Disc ink:** inverse, utilisé sur le fond ambre de la section finale.
- **Pill:** 3,1 rem de haut, filet d'encre de 1,5 px ; la variante pleine passe à l'ambre au survol.
- **Focus:** anneau d'encre de 3 px à 3 px de décalage (ambre sur les pièces sombres).

### Chips
- **Style:** transparent, filet de 1 px en couleur du texte, 99 px de rayon, 0,8125 rem, graisse 600. Étiquettes de prestation uniquement ; non interactives.

### Cards / Containers
- **Corner Style:** 16 px.
- **Background:** lin (cartes claires), galet (carte homme, vrac), ardoise (brushing), encre (boucles).
- **Shadow Strategy:** « Card » du vocabulaire d'ombres.
- **Border:** aucune.
- **Internal Padding:** `clamp(1.6rem, 2.6vw, 2.6rem)`.
- **Interaction:** inclinaison 3D (≈ 5° max) et reflet qui suit le pointeur, sur pointeur précis seulement.

### Navigation
- Barre fixe de 4,75 rem : marque (anneau + courbe + nom) à gauche, liens soulignés par un trait qui se dessine, pilule « Rendez-vous » à droite. Elle se cache en descendant, revient en remontant, et prend un fond sable une fois défilée. Sur mobile, un bouton rond ouvre un menu plein écran d'encre par un cercle qui grandit depuis ce bouton.

### Miroir (signature)
- Disque de verre à parallaxe interne, anneau d'encre double, reflet diagonal qui glisse avec le défilement. Existe en grand (accueil), moyen (chapitres, étapes) et petit (carte, accueil). Chaque photo a son recadrage dans le cercle.

### Ampoule suspendue (signature)
- Cordon de 1,5 px depuis une rosace, douille d'encre, verre ambre (blanc sur la section ambre), lueur douce. Elle oscille seule et penche vers le curseur.

## Do's and Don'ts

### Do:
- **Do** garder Ampoule Amber (#F2B233) comme seule couleur saturée, avec du texte Encre Ink dessus.
- **Do** mettre toute photo hors galerie dans un miroir à double anneau (2 px d'encre, 12 px d'écart).
- **Do** ouvrir les nouveaux éléments par un cercle depuis leur centre, avec une sortie exponentielle (`expo.out`).
- **Do** réserver les interlignes serrés aux titres de plus de 2,5 rem.
- **Do** dessiner les icônes en SVG au trait de 1,8 px, au même gabarit.
- **Do** garder une version allégée de chaque animation sous `prefers-reduced-motion`, et simplifier l'inclinaison, le curseur et la pinning sur mobile.

### Don't:
- **Don't** introduire une seconde couleur d'accent, ni remplacer l'ambre par une teinte terre cuite.
- **Don't** poser le papier peint de feuilles sur une photo ou une pièce sombre.
- **Don't** utiliser de la couleur ambre pour du texte courant sur fond clair (contraste insuffisant).
- **Don't** aligner des cartes de même taille avec une icône, un titre et un texte : les formats restent inégaux et les compositions distinctes.
- **Don't** ajouter de prix, de chiffres de fréquentation, de notes en étoiles ni d'avis inventés : seuls les faits fournis ou dérivables des horaires apparaissent.
- **Don't** animer autre chose que `transform`, `opacity`, `clip-path` et le tracé SVG dans les parcours de défilement.

### Défauts relevés, non érigés en règles
- Les titres de l'accueil (jusqu'à 8,4 rem), de la section finale (10 rem) et du pied de page (18 rem) dépassent le plafond habituel de 6 rem : c'est la demande explicite du brief (« titres géants »), à ne pas généraliser aux autres titres.
- Le détecteur signale un fond « crème/beige » sur la page : c'est la palette imposée par le brief (beige, blanc, gris), pas un oubli.
