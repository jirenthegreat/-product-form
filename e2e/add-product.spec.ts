import { expect, test, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Dodaj nowy produkt' })

async function openDialog(page: Page) {
  await page.getByRole('button', { name: 'Dodaj produkt' }).click()
  await expect(dialog(page)).toBeVisible()
}

async function selectOption(page: Page, label: string, option: string) {
  await page.getByRole('combobox', { name: label }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

async function fillBasicInfo(page: Page, name = 'iPad Air 11') {
  await page.getByLabel('Nazwa produktu').fill(name)
  await page.getByLabel('SKU produktu').fill('IPADAIR11')
  await page.getByLabel('Opis').fill('Tablet')
  await selectOption(page, 'Producent', 'Apple')
  await selectOption(page, 'Kategoria', 'Komputery')
  await page.getByRole('radio', { name: 'WiFi' }).or(page.getByRole('button', { name: 'WiFi' })).click()
}

const next = (page: Page) => page.getByRole('button', { name: 'Dalej' }).click()

test('krok 1 blokuje przejście dalej i pokazuje błędy przy polach', async ({ page }) => {
  await openDialog(page)
  await next(page)

  const errors = page.getByRole('alert')
  await expect(errors.filter({ hasText: 'Nazwa produktu jest wymagana' })).toBeVisible()
  await expect(errors.filter({ hasText: 'SKU jest wymagane' })).toBeVisible()
  await expect(errors.filter({ hasText: 'Producent jest wymagany' })).toBeVisible()
  await expect(errors.filter({ hasText: 'Kategoria jest wymagana' })).toBeVisible()
  await expect(errors.filter({ hasText: 'Wybierz co najmniej jedną cechę' })).toBeVisible()
  await expect(page.getByLabel('Nazwa produktu')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel('Cena netto')).toBeHidden()

  await page.getByLabel('SKU produktu').fill('ABC-123')
  await expect(page.getByText('SKU może zawierać tylko litery i cyfry')).toBeVisible()
  await page.getByLabel('Nazwa produktu').fill('ab')
  await expect(page.getByText('Nazwa musi mieć co najmniej 3 znaki')).toBeVisible()
})

test('ceny przeliczają się netto ⇄ brutto, a VAT przelicza cenę edytowaną wcześniej', async ({ page }) => {
  await openDialog(page)
  await fillBasicInfo(page)
  await next(page)

  const net = page.getByLabel('Cena netto')
  const gross = page.getByLabel('Cena brutto')

  await net.fill('100')
  await expect(gross).toHaveValue('123')

  await selectOption(page, 'Stawka VAT', '8%')
  await expect(net).toHaveValue('100')
  await expect(gross).toHaveValue('108')

  await gross.fill('246')
  await expect(net).toHaveValue('227.78')

  await selectOption(page, 'Stawka VAT', '23%')
  await expect(gross).toHaveValue('246')
  await expect(net).toHaveValue('200')
})

test('powrót do poprzedniego kroku nie gubi wartości', async ({ page }) => {
  await openDialog(page)
  await fillBasicInfo(page)
  await next(page)
  await page.getByLabel('Cena netto').fill('50')

  await page.getByRole('button', { name: 'Wstecz' }).click()
  await expect(page.getByLabel('Nazwa produktu')).toHaveValue('iPad Air 11')
  await expect(page.getByRole('combobox', { name: 'Producent' })).toHaveText('Apple')

  await next(page)
  await expect(page.getByLabel('Cena netto')).toHaveValue('50')
})

test('krok 3: ilość na magazynie tylko dla produktu limitowanego, min ≤ max', async ({ page }) => {
  await openDialog(page)
  await fillBasicInfo(page)
  await next(page)
  await page.getByLabel('Cena netto').fill('10')
  await next(page)

  const stock = page.getByLabel('Ilość na magazynie')
  await expect(stock).toBeHidden()
  await page.getByLabel('Produkt limitowany').click()
  await expect(stock).toBeVisible()

  await page.getByLabel('Minimalna ilość').fill('20')
  await page.getByRole('button', { name: 'Zapisz produkt' }).click()
  await expect(page.getByText('Podaj ilość na magazynie')).toBeVisible()
  await expect(page.getByText('Minimalna ilość nie może być większa niż maksymalna')).toBeVisible()
  await expect(page.getByText('Maksymalna ilość nie może być mniejsza niż minimalna')).toBeVisible()

  await stock.fill('-1')
  await expect(page.getByText('Ilość nie może być ujemna')).toBeVisible()

  await page.getByLabel('Produkt limitowany').click()
  await expect(stock).toBeHidden()
  await expect(page.getByText('Ilość nie może być ujemna')).toBeHidden()
})

test('zapisany produkt trafia do tabeli, a paginacja zostaje w URL po odświeżeniu', async ({ page }) => {
  await openDialog(page)
  await fillBasicInfo(page, 'Nowy produkt testowy')
  await next(page)
  await page.getByLabel('Cena netto').fill('100')
  await next(page)
  await page.getByLabel('Produkt limitowany').click()
  await page.getByLabel('Ilość na magazynie').fill('7')
  await page.getByRole('button', { name: 'Zapisz produkt' }).click()

  await expect(dialog(page)).toBeHidden()
  await expect(page.getByText('Produkt został dodany')).toBeVisible()
  await expect(page.getByText('6 produktów w katalogu')).toBeVisible()

  await page.getByRole('button', { name: 'Strona 2' }).click()
  await expect(page).toHaveURL(/\?page=2/)
  await page.reload()

  const list = page.getByRole('region', { name: 'Lista produktów' }).filter({ visible: true })
  await expect(list.getByText('Strona 2 z 2 · 6 produktów')).toBeVisible()
  await expect(list.getByText('Nowy produkt testowy')).toBeVisible()
  await expect(list.getByText('123,00 PLN')).toBeVisible()
})

test('zamknięcie dialogu resetuje formularz do kroku 1', async ({ page }) => {
  await openDialog(page)
  await fillBasicInfo(page)
  await next(page)
  await expect(page.getByLabel('Cena netto')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeHidden()

  await openDialog(page)
  await expect(page.getByLabel('Nazwa produktu')).toHaveValue('')
  await expect(page.getByRole('listitem').filter({ hasText: 'Informacje' })).toHaveAttribute('aria-current', 'step')
})
