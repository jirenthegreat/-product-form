# Produkty – wieloetapowy formularz dodawania produktu

Zadanie rekrutacyjne: trzyetapowy formularz dodawania produktu w oknie modalnym oraz tabela produktów z paginacją trzymaną w URL.

**Demo:** _link do Vercela_

## Stack

- React 19 + TypeScript + Vite
- [shadcn/ui](https://ui.shadcn.com) (Radix UI + Tailwind CSS v4) – komponenty w `src/components/ui`, tokeny z Figmy w `src/index.css`
- Geist (font z projektu)
- [TanStack Form](https://tanstack.com/form) – stan formularza i kroki
- [Zod](https://zod.dev) – schematy walidacji każdego kroku
- [nuqs](https://nuqs.dev) – numer strony tabeli w parametrze `?page=`
- sonner – toast po dodaniu produktu
- Vitest – testy jednostkowe (schematy Zod, przeliczanie cen, paginacja)
- Playwright – testy E2E całego przepływu (desktop + mobile)
- GitHub Actions – lint, typecheck i testy przy każdym pushu

## Uruchomienie

Wymagany Node.js 20.19+ (lub 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

Pozostałe skrypty:

```bash
npm run build      # typecheck + build produkcyjny
npm run preview    # podgląd builda
npm run typecheck  # sprawdzenie typów
npm run lint       # oxlint
npm test           # testy jednostkowe (Vitest)
npm run test:e2e   # testy E2E (Playwright)
```

Przed pierwszym uruchomieniem testów E2E trzeba pobrać przeglądarkę: `npx playwright install chromium`.

## Testy

Testy E2E (`e2e/add-product.spec.ts`) sprawdzają w przeglądarce, na desktopie i mobile, dokładnie to, co jest wymagane w zadaniu:

- krok 1 nie przepuszcza dalej bez poprawnych danych i pokazuje błędy przy polach,
- ceny przeliczają się netto ⇄ brutto, a zmiana VAT przelicza właściwe pole,
- „Wstecz” nie gubi wpisanych wartości,
- w kroku 3 pole ilości pojawia się tylko dla produktu limitowanego, a min ≤ max,
- zapisany produkt trafia do tabeli, a strona z URL zostaje po odświeżeniu,
- zamknięcie dialogu resetuje formularz do kroku 1.

## Struktura

```
e2e/                              # testy E2E (Playwright)
src/
├─ components/ui/                 # komponenty shadcn/ui dostosowane do projektu
└─ features/products/
   ├─ model/
   │  ├─ constants.ts             # predefiniowane listy (producenci, kategorie, VAT…)
   │  ├─ product-schema.ts        # schematy Zod dla kroków 1–3 (+ testy)
   │  ├─ types.ts                 # typy produktu i wartości formularza
   │  ├─ to-product.ts            # mapowanie danych z formularza na produkt
   │  └─ mock-products.ts         # 5 przykładowych produktów
   ├─ lib/                        # przeliczanie cen, paginacja, formatowanie (+ testy)
   ├─ hooks/use-products.ts       # lista produktów (zapis w localStorage)
   └─ components/
      ├─ products-page.tsx        # strona: nagłówek, tabela/karty, paginacja (nuqs)
      ├─ products-table.tsx       # tabela (desktop) i karty (mobile)
      ├─ products-pagination.tsx
      └─ add-product/
         ├─ add-product-dialog.tsx
         ├─ add-product-form.tsx  # logika kroków
         ├─ stepper.tsx
         ├─ step-*.tsx            # kroki formularza (withForm)
         ├─ form-context.ts       # createFormHook → useAppForm / withForm
         └─ form-fields.tsx       # pola połączone z TanStack Form
```

## Kluczowe decyzje

- **Jeden formularz na wszystkie kroki.** Wszystkie wartości żyją w jednym `useAppForm`, a krok to tylko to, co jest wyrenderowane. Dlatego „Wstecz” nie gubi danych.
- **Walidacja per krok.** Walidator formularza (`onChange`) używa schematu Zod bieżącego kroku (`productFormSteps[step]`). „Dalej” to zwykły submit: `onSubmit` wywoła się tylko przy poprawnych danych kroku i wtedy zwiększa krok. Na ostatnim kroku całość jest parsowana pełnym schematem (`productFormSchema`), który zwraca już zawężone typy (`z.enum`, `z.literal`).
- **Kiedy pokazujemy błędy.** Walidacja działa na bieżąco. Błąd pojawia się, gdy pole zostało dotknięte albo użytkownik próbował przejść dalej (submit oznacza pola jako dotknięte). Komunikaty są po polsku, przy konkretnym polu, powiązane przez `aria-describedby`.
- **Reguły między polami** (ilość na magazynie wymagana tylko dla produktu limitowanego, min ≤ max) są w `superRefine` z `when: () => true`. Dzięki temu pokazują się razem z innymi błędami.
- **Przeliczanie cen.** Listenery pól `netPrice` / `grossPrice` / `vatRate` przeliczają drugie pole wg wzoru `brutto = netto × (1 + VAT/100)`. Przeliczona wartość jest ustawiana z `dontRunListeners`, więc nie ma pętli. Ukryte pole `priceSource` pamięta, które pole użytkownik edytował ostatnio: zmiana VAT przelicza to drugie. Kwoty są zaokrąglane do groszy.
- **Reset dialogu.** Radix odmontowuje zawartość zamkniętego dialogu, więc każde otwarcie tworzy świeży formularz (krok 1, wartości domyślne). Kliknięcie w tło nie zamyka modala, żeby nie stracić danych przypadkiem. Zamykają go X i Esc.
- **Paginacja.** `useQueryState('page', parseAsInteger.withDefault(1))`, 5 produktów na stronę. Numer spoza zakresu jest przycinany. Produkty są zapisywane w localStorage, dzięki czemu odświeżenie zachowuje cały widok, łącznie z dodanymi produktami.
- **Zgodność z Figmą.** Kolory, typografia, odstępy i zaokrąglenia są wzięte bezpośrednio z pliku Figma (neutralna paleta shadcn, `blue-600` jako kolor główny, font Geist). Wymiary dialogów na desktopie (546 / 370 / 440 px) zgadzają się z projektem co do piksela. Pole „Stawka VAT” jest selectem zgodnie ze specyfikacją, choć w Figmie wygląda jak input, a etykieta nad opisem to „Opis” (w projekcie jest tam zdublowana „Nazwa produktu”).
- **RWD.** Na desktopie jest tabela i wyśrodkowany modal. Na mobile są karty i pełnoekranowy dialog ze stepperem w kolumnach (zgodnie z Figmą).
