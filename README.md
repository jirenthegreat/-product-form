# Produkty – wieloetapowy formularz dodawania produktu

Trzyetapowy formularz w oknie modalnym oraz tabela produktów z paginacją trzymaną w URL.

**Demo:** _link do Vercela_

## Stack

- React 19 + TypeScript + Vite
- shadcn/ui (Radix UI + Tailwind CSS v4), tokeny z Figmy w `src/index.css`
- TanStack Form – stan formularza i kroki
- Zod – schematy walidacji każdego kroku
- nuqs – numer strony w parametrze `?page=`
- sonner – toast po dodaniu produktu
- Vitest i Playwright, uruchamiane w GitHub Actions

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # typecheck + build produkcyjny
npm run lint       # oxlint
npm test           # testy jednostkowe
npm run test:e2e   # testy E2E (wcześniej: npx playwright install chromium)
```

## Struktura

```
e2e/                          # testy E2E
src/
├─ components/ui/             # komponenty shadcn/ui
└─ features/products/
   ├─ model/                  # typy, schematy Zod, dane mockowe
   ├─ lib/                    # przeliczanie cen, paginacja, formatowanie
   ├─ hooks/                  # lista produktów
   └─ components/
      ├─ products-page.tsx    # strona: nagłówek, tabela/karty, paginacja
      └─ add-product/         # dialog, kroki formularza, pola
```

## Kluczowe decyzje

- **Jeden formularz na wszystkie kroki.** Wartości żyją w jednym `useAppForm`, a krok decyduje tylko o tym, co jest wyrenderowane, więc „Wstecz” nie gubi danych.
- **Walidacja per krok.** Walidator formularza dostaje schemat bieżącego kroku (`productFormSteps[step]`), a „Dalej” to zwykły submit – krok zmienia się dopiero przy poprawnych danych. Na końcu całość parsuje pełny schemat.
- **Kiedy pokazuję błędy.** Dopiero gdy użytkownik coś w polu wpisał albo kliknął „Dalej”. Samo wejście i wyjście z pustego pola nie zapala czerwieni, a uzupełnienie jednego pola gasi tylko jego błąd.
- **Przeliczanie cen.** `brutto = netto × (1 + VAT/100)`, liczone w listenerach pól. Przeliczona wartość jest ustawiana z `dontRunListeners`, żeby nie powstała pętla, a ukryte pole `priceSource` pamięta, którą cenę edytowano ostatnio – to ona zostaje przy zmianie VAT.
- **Pola liczbowe to inputy tekstowe z `inputMode`.** `type="number"` odrzuca przecinek, gdy przeglądarka ma inny język niż polski, więc „12,5” zamieniało się w „125”.
- **Reset dialogu.** Radix odmontowuje zawartość zamkniętego okna, więc każde otwarcie tworzy świeży formularz od kroku 1. Kliknięcie w tło nie zamyka okna, żeby nie stracić danych; zamykają je X i Esc.
- **Paginacja.** `useQueryState('page', parseAsInteger.withDefault(1))`, 5 produktów na stronę, numer spoza zakresu jest przycinany. Produkty trzymam w localStorage, żeby odświeżenie zachowało cały widok.

## Uwagi do projektu z Figmy

- Komponenty pochodzą z `npx shadcn add`. W samych plikach zmieniałem tylko to, co w projekcie obowiązuje globalnie (zaokrąglenia, wysokości pól, paddingi tabeli, wymiary dialogu) – każda zmiana ma komentarz. Reszta różnic jest ustawiana przez `className` w miejscu użycia.
- „Stawka VAT” jest selectem zgodnie ze specyfikacją, choć w Figmie wygląda jak zwykły input.
- Etykieta nad polem opisu to „Opis” – w Figmie jest tam zdublowana „Nazwa produktu”.
